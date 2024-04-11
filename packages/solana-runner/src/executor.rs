use std::fmt::Write;
use std::process::ExitStatus;

use anyhow::Context;
use lazy_static::lazy_static;
use tokio::io::AsyncBufReadExt;
use tokio::process::Command;

use crate::lesson::Lesson;
use crate::types::{TTest, TTestRequest};

pub struct TestExecutor {
    /// working directory for the tests
    dir: std::path::PathBuf,
    test_request: TTestRequest,
}

impl TestExecutor {
    pub fn new(dir: std::path::PathBuf, test_request: TTestRequest) -> Self {
        Self { dir, test_request }
    }

    pub async fn perform_test(&self, lesson: &Lesson) -> anyhow::Result<Vec<TTest>> {
        // prepare working directory
        // let _ = std::fs::remove_dir_all(&self.dir)
        //     .context("remove_dir_all");
        std::fs::create_dir_all(&self.dir)
            .context("create_dir_all")?;
        tracing::debug!("Executor dir re-created clean: {:?}", self.dir);
        // step 1: create project files
        self.use_template(&lesson)?;

        // step 2: add source files coming with the request under `src`; one of them is expected to be the lib.rs
        let src = self.dir.join("src");
        for file in &self.test_request.files {
            let path = src.join(&file.path);
            tracing::debug!("Writing src file: {:?} to {:?}", file.path, path);
            path.parent().map(std::fs::create_dir_all);
            std::fs::write(&path, &file.content)?;
        }

        // step 2b: copy target from dummy project, to reduce the need to recompile dependencies
        let target = self.dir.join("target/");
        if !target.exists() {
            std::fs::create_dir(&target)?;
            // call `rsync -azi --delete /tmp/dummy-program/ /tmp/unknown/introduction/`
            // this is a hack to avoid recompiling dependencies, because rsync is very careful about preserving timestamps
            let dummy_program_target = std::path::PathBuf::from("/tmp/dummy-program/target/");
            tracing::debug!("Copying target from dummy project: {:?} to {:?}", dummy_program_target, target);
            let mut rsync_cmd = Command::new("rsync");
            rsync_cmd
                .arg("-azi")
                .arg("--delete")
                .arg(dummy_program_target)
                .arg(&target);
            let status = tracing_execute(&mut rsync_cmd, &mut Vec::new()).await?;
            if !status.success() {
                anyhow::bail!("Failed to prepare working directory with dummy project; exit code = {:?}", status);
            }
        }
        // step 3: compile the project using cargo build-bpf
        tracing::info!("Compiling project");

        let mut cargo_build_command = cargo_cmd();
        cargo_build_command.current_dir(&self.dir);
        cargo_build_command.arg("build-bpf");
        cargo_build_command.arg("--offline");
        let mut res = Vec::new();
        let status = tracing_execute(&mut cargo_build_command, &mut res).await?;
        if !status.success() {
            tracing::warn!("Failed to compile code");
            anyhow::bail!("Failed to compile code; exit code = {:?}", status);
        }

        // step 4: run the tests
        tracing::info!("Running tests");
        let mut test_run_cmd = cargo_cmd();
        test_run_cmd.current_dir(&self.dir);
        test_run_cmd.args(&["test-sbf", "--jobs", "1", "--test", "lesson_tests"]);
        test_run_cmd.arg("--offline");
        let status = tracing_execute(&mut test_run_cmd, &mut res).await?;
        if !status.success() {
            tracing::warn!("Failed to execute tests");
            // don't fail here, we want to collect test results
        }
        Ok(res)
    }

    fn use_template(&self, lesson: &Lesson) -> anyhow::Result<()> {
        let template_src = &lesson.dir;
        // deep copy the template into the project_dir
        tracing::debug!("Copying files from template: {:?} to directory: {:?}", template_src, self.dir);
        let options = fs_extra::dir::CopyOptions::new()
            .overwrite(true)
            .content_only(true);
        fs_extra::dir::copy(&template_src, &self.dir, &options)
            .context("copy_from_template")?;
        Ok(())
    }
}

fn cargo_cmd() -> Command {
    //TODO configurable, or init script?
    match dirs::home_dir() {
        Some(home) => {
            let cargo_exe = home.join(".cargo/bin/cargo");
            // if executable, use it
            if cargo_exe.is_file() {
                Command::new(cargo_exe)
            } else {
                Command::new("cargo")
            }
        }
        None => {
            Command::new("cargo")
        }
    }
}


async fn tracing_execute(cmd: &mut Command, tests: &mut Vec<TTest>) -> anyhow::Result<ExitStatus> {
    cmd.kill_on_drop(true);
    tracing::debug!("Executing: {:?}", cmd);
    let mut child = cmd
        .stderr(std::process::Stdio::piped())
        .stdout(std::process::Stdio::piped())
        .spawn()?;
    let stderr = child.stderr.take().unwrap();
    let stdout = child.stdout.take().unwrap();
    tokio::spawn(async move {
        let mut stderr = tokio::io::BufReader::new(stderr).lines();
        while let Some(line) = stderr.next_line().await.unwrap() {
            tracing::debug!("stderr: {line}");
        }
    });

    let (tx, mut rx) = tokio::sync::mpsc::channel(10000);

    tokio::spawn(async move {
        let mut stdout = tokio::io::BufReader::new(stdout).lines();
        while let Some(line) = stdout.next_line().await.unwrap() {
            tracing::debug!("stdout: {line}");
            tx.send(line).await.unwrap()
        }
    });
    let status = child.wait().await?;
    let test_results = test_results_from_stdout(&mut rx).await?;
    tests.extend(test_results);
    Ok(status)
}

async fn test_results_from_stdout(rx: &mut tokio::sync::mpsc::Receiver<String>) -> anyhow::Result<Vec<TTest>> {
    let mut tests = Vec::new();
    let mut tests_failed = Vec::new();
    let mut collecting_key = String::new();
    let mut collected_lines = String::new();
    while let Some(line) = rx.recv().await {
        if let Some(captures) = TEST_RESULT_REGEX.captures(&line) {
            let test_name = captures.name("test_name").unwrap().as_str().to_string();
            let result = captures.name("result").unwrap().as_str();
            tracing::debug!("Detected test result: {test_name} -> {result}");
            match result {
                "ok" => tests.push(TTest::ok(test_name)),
                "FAILED" => tests_failed.push(test_name),
                _ => tracing::warn!("Unknown test result: '{result}' for test {test_name}"),
            }
        } else if line.starts_with("---- ") && line.ends_with(" stdout ----") {
            collecting_key = line.trim_start_matches("---- ").trim_end_matches(" stdout ----").to_string();
            tracing::trace!("Collecting starts for key: {collecting_key}");
        } else if line.is_empty() {
            if !collecting_key.is_empty() {
                let test_name = std::mem::replace(&mut collecting_key, String::new());
                let test_fail_details = std::mem::replace(&mut collected_lines, String::new());
                tracing::trace!("Collecting ends for key: {}", test_name);
                let test = TTest::error(test_name, test_fail_details);
                tests.push(test);
            }
        } else if !collecting_key.is_empty() {
            if line.contains("assert") {
                tracing::trace!("Collecting line: {line}");
                collected_lines.write_str(&line).unwrap();
                collected_lines.write_str("\n").unwrap();
            }
        }
    }
    tracing::debug!("Tests: {tests:?}");
    Ok(tests)
}

lazy_static!(
    static ref TEST_RESULT_REGEX: regex::Regex = regex::Regex::new(r#"test (?P<test_name>[^ ]+) ... (?P<result>ok|FAILED)"#).unwrap();
);
