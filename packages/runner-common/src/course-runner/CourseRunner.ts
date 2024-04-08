import { CourseBase } from './course';
import {
  TActionRequest,
  TActionResponse,
  TEditorFile,
  TEditorFileMap,
  TTest,
  TTestResponse,
} from '../types';
import { CourseMetadata, TCourseMeta, TTestMeta } from './CourseMetadata';

/**
 * Class responsible for running tests for a given course and lesson.
 */
export class CourseRunner {
  courseMap: Map<string, TCourseMeta> = new Map();
  // for tests
  lastTestResult: TTestResponse;

  constructor(courses: (new () => CourseBase)[]) {
    for (const courseConstructor of courses) {
      const courseMeta = CourseMetadata.getCourseMeta(courseConstructor);
      this.courseMap.set(courseMeta.slug, courseMeta);
    }
  }

  getCourses(): TCourseMeta[] {
    return Array.from(this.courseMap.values());
  }

  /**
   * Run tests for a given course and lesson.
   *
   * Tests can be run in one of two modes:
   *
   * 1. User mode - Tests are run to evaluate the user's code submission, results are returned as a JSON to the browser
   * 2. Development mode - This mode targets the author of the lesson. It runs the tests in the Mocha test runner and
   *    reports failures in a usual way - stack traces etc. included).
   *
   * @param courseSlug
   * @param lessonSlug
   * @param files
   * @param mode
   * @param testTitle (for mode = 'development') Check results only for this test. Results of all other tests are ignored.
   *                 This is used when running checks for tests.
   */
  async test<RES extends TTestResponse>(
    courseSlug: string,
    lessonSlug: string,
    files: TEditorFile[],
    mode: 'user' | 'development' = 'user',
    testTitle?: string,
  ): Promise<RES> {
    const courseMeta = this.courseMap.get(courseSlug);
    if (!courseMeta) {
      throw new Error(`Course ${courseSlug} not found`);
    }

    const lessons = CourseMetadata.getLessons(courseMeta);
    const lessonMeta = lessons.find(lesson => lesson.slug === lessonSlug);
    if (!lessonMeta) {
      throw new Error(`Lesson ${lessonSlug} not found`);
    }

    if (mode === 'development' && !testTitle) {
      throw new Error(`Test name must be provided in development mode`);
    }

    const result: TTestResponse = {
      passed: true,
      tests: [],
    };
    this.lastTestResult = result;

    const filesMap = toFilesMap(files);

    const context = {};
    const course = new courseMeta.constructor();
    course.files = filesMap;
    course.context = context;
    course.result = result;
    const lesson = new lessonMeta.constructor();
    lesson.files = filesMap;
    lesson.context = context;
    lesson.result = result;

    const tests = CourseMetadata.getTests(lesson);

    const shouldThrow = (test: TTestMeta) => mode === 'development' && test.title === testTitle;

    const beforeAll = async () => {
      try {
        if (course.beforeAll) {
          await course.beforeAll();
        }
        if (lesson.beforeAll) {
          await lesson.beforeAll();
        }
      } catch (err) {
        result.error = err.message;
        result.passed = false;
        await afterAll(true);
        if (mode === 'development') {
          // throw, Mocha will pick up the error
          throw err;
        }
      }
    };

    const beforeEach = async (test: TTestMeta): Promise<TTest> => {
      try {
        if (course.beforeEach) {
          await course.beforeEach();
        }
        if (lesson.beforeEach) {
          await lesson.beforeEach();
        }
      } catch (err) {
        await afterEach(test, true);
        if (mode === 'development' && test.title === testTitle) {
          // throw, Mocha will pick up the error
          throw err;
        }
        return { title: test.title, passed: false, error: err.message };
      }
    };

    const runTest = async (test: TTestMeta): Promise<TTest> => {
      try {
        await test.fn.call(lesson);
      } catch (err) {
        await afterEach(test, true);
        if (mode === 'development' && test.title === testTitle) {
          // throw, Mocha will pick up the error
          throw err;
        }
        return { title: test.title, passed: false, error: err.message };
      }
    };

    const afterEach = async (test: TTestMeta, ignoreResult = false): Promise<TTest> => {
      try {
        if (lesson.afterEach) {
          await lesson.afterEach();
        }
        if (course.afterEach) {
          await course.afterEach();
        }
      } catch (err) {
        if (ignoreResult) {
          return null;
        }

        if (mode === 'development' && test.title === testTitle) {
          // throw, Mocha will pick up the error
          throw err;
        }
        return { title: test.title, passed: false, error: err.message };
      }
    };

    const afterAll = async (ignoreResult = false) => {
      try {
        if (lesson.afterAll) {
          await lesson.afterAll();
        }
        if (course.afterAll) {
          await course.afterAll();
        }
      } catch (err) {
        if (ignoreResult) {
          return;
        }

        if (mode === 'development') {
          // throw, Mocha will pick up the error
          throw err;
        }
        result.error = err.message;
        result.passed = false;
      }
    };

    await beforeAll();
    if (result.error) {
      return result as RES;
    }

    for (const test of tests) {
      if (mode === 'development' && test.title !== testTitle) {
        continue;
      }

      let res = await beforeEach(test);
      if (res) {
        result.tests.push(res);
        result.passed = false;
        continue;
      }

      res = await runTest(test);
      if (res) {
        result.tests.push(res);
        result.passed = false;
        continue;
      }

      res = await afterEach(test);
      if (res) {
        result.tests.push(res);
        result.passed = false;
        continue;
      }

      result.tests.push({ title: test.title, passed: true });
    }

    await afterAll();

    return result as RES;
  }

  async action<RES = unknown>(req: TActionRequest): Promise<TActionResponse<RES>> {
    const courseMeta = this.courseMap.get(req.courseSlug);
    if (!courseMeta) {
      throw new Error(`Course ${req.courseSlug} not found`);
    }

    const lessons = CourseMetadata.getLessons(courseMeta);
    const lessonMeta = lessons.find(lesson => lesson.slug === req.lessonSlug);

    const filesMap = toFilesMap(req.files);

    const context = {};
    const course = new courseMeta.constructor();
    course.files = filesMap;
    course.context = context;
    const courseActions = CourseMetadata.getActions(course);
    const courseAction = courseActions.find(a => a.name === req.action);

    let lesson, lessonAction;
    if (lessonMeta) {
      lesson = new lessonMeta.constructor();
      lesson.files = filesMap;
      lesson.context = context;
      const lessonActions = CourseMetadata.getActions(lesson);
      lessonAction = lessonActions.find(a => a.name === req.action);
    }

    const target = courseAction ? course : lesson;
    const action = lessonAction || courseAction;

    if (!action) {
      throw new Error(
        `Action ${req.action} for course ${req.courseSlug} and ${req.lessonSlug} not found`,
      );
    }

    try {
      const res = await action.fn.call(target, req);
      return { body: res };
    } catch (err) {
      console.error(`Error while running action ${req.courseSlug}/${req.action}: ${err.stack}`);
      return { error: err.message };
    }
  }
}

export function toFilesArray(map: TEditorFileMap): TEditorFile[] {
  return Object.entries(map).map(([path, file]) => ({ path, content: file.content }));
}

export function toFilesMap(array: TEditorFile[]): TEditorFileMap {
  const map: TEditorFileMap = {};
  for (const file of array) {
    map[file.path] = { content: file.content };
  }
  return map;
}
