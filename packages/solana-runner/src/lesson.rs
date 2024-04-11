use std::path::{Path, PathBuf};

#[derive(Debug)]
pub struct Course {
    pub lessons_by_slug: std::collections::HashMap<String, Lesson>,
    pub basedir: PathBuf,
}


impl Course {
    pub fn from_dir(basedir: &Path, prefix: &str) -> anyhow::Result<Self> {
        let mut lessons_by_slug = std::collections::HashMap::new();
        tracing::debug!("Loading course code from directory {basedir:?}");
        let basedir = match basedir.canonicalize() {
            Ok(basedir) => basedir,
            Err(e) => {
                let cwd = std::env::current_dir()?;
                tracing::error!("Current working directory: {:?} does not contain {:?}", cwd.display(), basedir.display());
                return Err(e.into());
            }
        };
        for entry in std::fs::read_dir(&basedir)? {
            let entry = entry?;
            let path = entry.path();
            if path.is_dir() {
                let lesson_slug = path.file_name().ok_or(anyhow::anyhow!("Invalid lesson slug"))?
                    .to_string_lossy()
                    .to_string();
                if !lesson_slug.starts_with(prefix) {
                    continue;
                }
                let lesson_slug = lesson_slug[prefix.len()..].to_string();
                let lesson = Lesson { slug: lesson_slug, dir: path };
                tracing::debug!("Registering lesson: {lesson:?}");
                lessons_by_slug.insert(lesson.slug.clone(), lesson);
            }
        }
        Ok(Self { lessons_by_slug, basedir})
    }

    pub fn lesson(&self, lesson_slug: &str) -> Option<&Lesson> {
        self.lessons_by_slug.get(lesson_slug)
    }

}

#[derive(Debug)]
pub struct Lesson {
    pub slug: String,
    pub dir: PathBuf,
}
