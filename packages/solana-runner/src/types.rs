use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct TTestRequest {
    pub runner: String,
    pub r#type: Option<String>,
    #[serde(rename = "courseSlug")]
    pub course_slug: String,
    #[serde(rename = "lessonSlug")]
    pub lesson_slug: String,
    pub files: Vec<TEditorFile>,
    pub image: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct TEditorFile {
    pub path: String,
    pub content: String,
}

#[derive(Serialize)]
pub struct TTestResponse {
    passed: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<String>,
    // gas: Option<usize>,
    tests: Vec<TTest>,
}

impl TTestResponse {

    /// Create a response with an error message, explaining why the tests could not be run
    pub fn error(error: impl ToString) -> Self {
        Self { passed: false, error: Some(error.to_string()), tests: vec![] }
    }
}

impl From<Vec<TTest>> for TTestResponse {
    /// Create a response with the results of the tests
    ///
    /// Note that top-level `passed` is set to `true` only if all tests passed; and, there must be at least one
    fn from(tests: Vec<TTest>) -> Self {
        if tests.is_empty() {
            return Self::error("No tests executed.");
        }
        let failed_count = tests.iter()
            .filter(|test| !test.passed)
            .count();
        let passed = failed_count == 0;
        let error = if passed { None } else { Some(format!("{} of {} tests failed", failed_count, tests.len())) };
        Self { passed, error, tests }
    }
}

#[derive(Debug,Serialize)]
pub struct TTest {
    pub title: String,
    passed: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<String>,
}

impl TTest {
    pub fn error(title: impl ToString, error: impl ToString) -> Self {
        Self { title: title.to_string(), passed: false, error: Some(error.to_string()) }
    }

    pub fn ok(title: impl ToString) -> Self {
        Self { title: title.to_string(), passed: true, error: None }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn de_solve_request() {
        let body = r##"{
    "runner": "docker-runner",
    "image": "rbiosas/nearjs-docker-runner",
    "type": "course",
    "courseSlug": "introduction-to-nearjs",
    "lessonSlug": "04-environment",
    "files": [
        {
            "path": "contract.ts",
            "content": "// your code here\n"
        }
    ]
}
"##;
        let parsed: TTestRequest = serde_json::from_str(body).unwrap();
        let parsed = format!("{parsed:?}");
        println!("parsed: {parsed}");

        assert_eq!(parsed, r##"TTestRequest { runner: "docker-runner", type: Some("course"), course_slug: "introduction-to-nearjs", lesson_slug: "04-environment", files: [TEditorFile { path: "contract.ts", content: "// your code here\n" }], image: Some("rbiosas/nearjs-docker-runner") }"##)
    }

    #[test]
    fn ser_solve_response() {
        let response = TTestResponse {
            passed: false,
            error: None,
            tests: vec![
                TTest {
                    title: "HI! Method `increment` should increment the user's personal counter".to_string(),
                    passed: true,
                    error: None,
                },
                TTest {
                    title: "HI! Method `get_value` should accept accountId parameter".to_string(),
                    passed: false,
                    error: Some("expected 3 to equal 1".to_string()),
                },
            ],
        };
        let serialized = serde_json::to_string_pretty(&response).unwrap();
        println!("serialized: {serialized}");
        assert_eq!(r##"{
  "passed": false,
  "tests": [
    {
      "title": "HI! Method `increment` should increment the user's personal counter",
      "passed": true
    },
    {
      "title": "HI! Method `get_value` should accept accountId parameter",
      "passed": false,
      "error": "expected 3 to equal 1"
    }
  ]
}"##, serialized);

    }
}
