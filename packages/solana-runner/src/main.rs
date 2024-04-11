use std::path::PathBuf;

use axum::{
    Json,
    Router, routing::post,
};

use types::{TTestRequest, TTestResponse};

mod types;
mod lesson;
mod executor;

lazy_static::lazy_static!(
    pub static ref COURSE: lesson::Course = {
        let basedir = PathBuf::from("lessons-code");
        lesson::Course::from_dir(&basedir, "solana-").unwrap()
    };
);

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // initialize tracing
    let logvar = std::env::var("AGORA_LOG")
        .unwrap_or_else(|_| "info".to_string());
    tracing_subscriber::fmt()
        // .with_env_filter("agorapp=debug")
        .with_env_filter(logvar)
        .init();

    let lesson_count = COURSE.lessons_by_slug.len();
    if lesson_count == 0 {
        tracing::error!("No lessons found");
        anyhow::bail!("No lessons found in {}", COURSE.basedir.display())
    }
    tracing::info!("Registered {} lessons from directory {}", lesson_count, COURSE.basedir.display());
    // build our application with a route
    let app = Router::new()
        // `POST /users` goes to `create_user`
        .route("/v1/solve", post(solve))
        .route("/v1/solve/", post(solve))
        ;

    // run our app with hyper
    let listener = tokio::net::TcpListener::bind("0.0.0.0:7005")
        .await
        .unwrap();
    tracing::info!("Listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await?;
    Ok(())
}

async fn solve(Json(test_request): Json<TTestRequest>) -> Json<TTestResponse> {
    tracing::debug!("solve: {:?}", test_request);
    let session_id = "session_0001"; //TODO: get session_id from headers
    //TODO: add session locking

    let lesson_slug = &test_request.lesson_slug;
    tracing::debug!("session: {session_id} lesson_slug: {lesson_slug}");
    let Some(lesson) = COURSE.lesson(&lesson_slug) else {
        tracing::error!("lesson not found: {lesson_slug}");
        return Json(TTestResponse::error(format!("Lesson not found: {lesson_slug}")));
    };

    let dir = std::path::PathBuf::from("/tmp")
        .join(session_id);
    tracing::info!("Solving lesson {lesson:?} in {dir:?}");
    let executor = executor::TestExecutor::new(dir, test_request);
    let response = match executor.perform_test(lesson).await {
        Ok(mut test_results) => {
            test_results.sort_by(|a, b| a.title.cmp(&b.title));
            tracing::info!("Results: {test_results:?}");
            TTestResponse::from(test_results)
        },
        Err(err) => {
            tracing::error!("{}", err);
            TTestResponse::error(err.to_string())
        },
    };
    Json(response)
}
