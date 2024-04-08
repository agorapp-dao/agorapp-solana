import { red } from 'colorette';
import dedent from 'ts-dedent';
import { CourseRunner, toFilesArray } from './CourseRunner';
import { CourseMetadata, TCheck, TCourseMeta, TLessonMeta, TTestMeta } from './CourseMetadata';
import { expect } from './course';

/**
 * Checks @CheckXXX annotations on course lessons. These are "unit tests" for the course.
 */
export class CourseChecker {
  constructor(private runner: CourseRunner) {}

  /**
   * Generates mocha tests for all courses registered in the `CourseRunner`. Uses @Passes and
   * @Fails annotations to generate tests.
   */
  generateTests() {
    for (const courseMeta of this.runner.getCourses()) {
      this._generateDescribe(courseMeta, () => {
        const lessons = CourseMetadata.getLessons(courseMeta);
        for (const lessonMeta of lessons) {
          this._generateDescribe(lessonMeta, () => {
            const lessonChecks = CourseMetadata.getLessonChecks(lessonMeta);
            const tests = CourseMetadata.getTests(new lessonMeta.constructor());
            for (const test of tests) {
              const testChecks = CourseMetadata.getTestChecks(test);
              if (!testChecks.length && !lessonChecks.length) {
                console.log(
                  red(dedent`
                  No checks defined for '${courseMeta.slug}/${lessonMeta.slug}/${test.title}'.
                  
                  Add @Passes() or @Fails() to your test or lesson.
                
              `),
                );
                process.exit(1);
              }

              this._generateTestDescribe(test, () => {
                this._generateChecks(courseMeta, lessonMeta, test, lessonChecks, testChecks);
              });
            }
          });
        }
      });
    }
  }

  private _generateDescribe(subject: TCourseMeta | TLessonMeta, fn: () => void) {
    if (subject.only) {
      describe.only(subject.slug, fn);
    } else if (subject.skip) {
      describe.skip(subject.slug, fn);
    } else {
      describe(subject.slug, fn);
    }
  }

  private _generateTestDescribe(subject: TTestMeta, fn: () => void) {
    if (subject.only) {
      describe.only(subject.title, fn);
    } else if (subject.skip) {
      describe.skip(subject.title, fn);
    } else {
      describe(subject.title, fn);
    }
  }

  private _generateChecks(
    course: TCourseMeta,
    lesson: TLessonMeta,
    test: TTestMeta,
    lessonChecks: TCheck[],
    testChecks: TCheck[],
  ) {
    const timeout = test.timeout || lesson.timeout || course.timeout || 4_000;
    const generateCheck = (check: TCheck) => {
      if (check.kind === 'passes') {
        this._generateTest(check, timeout, async () => {
          const res = await this.runner.test(
            course.slug,
            lesson.slug,
            toFilesArray(check.files),
            'development',
            test.title,
          );
          if (check.resultMatch) {
            expect(res).to.include(check.resultMatch);
          }
        });
      }

      if (check.kind === 'fails') {
        this._generateTest(check, timeout, async () => {
          let err;
          try {
            await this.runner.test(
              course.slug,
              lesson.slug,
              toFilesArray(check.files),
              'development',
              test.title,
            );
          } catch (e) {
            err = e;
          }

          if (!err) {
            expect.fail('Expected test to fail');
          }
          if (check.match) {
            expect(err.stack || err.message).to.include(check.match);
          }
        });
      }
    };

    for (const check of testChecks.concat(lessonChecks)) {
      generateCheck(check);
    }
  }

  private _generateTest(check: TCheck, timeout: number, fn: () => Promise<void>) {
    if (check.only) {
      it.only(check.name, fn).timeout(timeout);
    } else if (check.skip) {
      it.skip(check.name, fn).timeout(timeout);
    } else {
      it(check.name, fn).timeout(timeout);
    }
  }
}
