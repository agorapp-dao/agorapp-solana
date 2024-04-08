import { Boom, boomify, notFound } from '@hapi/boom';
import { errors } from './errors';

export class ErrorFactory {
  public static throwUnrecognizedSubmissionType(): void {
    throw boomify(new Error(errors.UNRECOGNIZED_SUBMISSION_TYPE), {
      statusCode: 400,
    });
  }

  public static throwCourseIdNotFound(): void {
    throw notFound(errors.UNRECOGNIZED_COURSE_ID);
  }

  public static throwChallengeIdNotFound(): void {
    throw notFound(errors.UNRECOGNIZED_CHALLENGE_ID);
  }

  public static throwChallengeSubIdNotFound(): void {
    throw notFound(errors.UNRECOGNIZED_CHALLENGE_SUB_ID);
  }

  public static throwUnrecognizedEnvironmentCtx(): void {
    throw boomify(new Error(errors.UNRECOGNIZED_ENVIRONMENT_CONTEXT), {
      statusCode: 500,
    });
  }

  public static throwInternalServerError(): Boom<unknown> {
    // it's meant to be used by the fallback middleware, so no need to throw an error programmatically
    return boomify(new Error(errors.FALLBACK_INTERNAL_SERVER_ERROR), {
      statusCode: 500,
    });
  }
}
