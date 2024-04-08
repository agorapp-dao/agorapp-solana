import { Action, Course, CourseBase, Lesson, LessonBase, Test } from './course';
import { CourseRunner } from './CourseRunner';
import { expect } from 'chai';
import { TActionRequest, TActionResponse, TTestResponse } from '../types';
import sinon from 'sinon';

describe('course-runner', () => {
  it('run test', async () => {
    @Course('sample-course')
    class SampleCourse extends CourseBase {
      lessons = [SampleLesson];
    }
    @Lesson('01-test-lesson')
    class SampleLesson extends LessonBase {
      @Test('Should be true')
      test1() {
        expect(this.files['main.js'].content).to.equal('true');
      }
    }

    const runner = new CourseRunner([SampleCourse]);

    const resOk = await runner.test('sample-course', '01-test-lesson', [
      { path: 'main.js', content: 'true' },
    ]);
    expect(resOk.passed).to.equal(true);
    expect(resOk.error).to.be.undefined;
    expect(resOk.tests).to.deep.equal([{ title: 'Should be true', passed: true }]);

    const resFailed = await runner.test('sample-course', '01-test-lesson', [
      {
        path: 'main.js',
        content: 'false',
      },
    ]);
    expect(resFailed.passed).to.equal(false);
    expect(resOk.error).to.be.undefined;
    expect(resFailed.tests.length).to.equal(1);
    expect(resFailed.tests[0].title).to.equal('Should be true');
    expect(resFailed.tests[0].passed).to.equal(false);
  });

  it('lesson - beforeAll, beforeEach, afterEach and afterAll', async () => {
    interface SampleCourseRes extends TTestResponse {
      beforeAllCounter: number;
      beforeEachCounter: number;
      afterEachCounter: number;
      afterAllCounter: number;
    }

    @Course('sample-course')
    class SampleCourse extends CourseBase<unknown, SampleCourseRes> {
      lessons = [SampleLesson];
    }
    @Lesson('01-test-lesson')
    class SampleLesson extends LessonBase<unknown, SampleCourseRes> {
      async beforeAll() {
        this.result.beforeAllCounter = 0;
        this.result.beforeEachCounter = 0;
        this.result.afterEachCounter = 0;
        this.result.afterAllCounter = 0;

        this.result.beforeAllCounter++;
      }
      async beforeEach() {
        this.result.beforeEachCounter++;
      }
      async afterEach() {
        this.result.afterEachCounter++;
      }
      async afterAll() {
        this.result.afterAllCounter++;
      }

      @Test('test1')
      test1() {
        expect(this.result.beforeAllCounter).to.equal(1);
        expect(this.result.beforeEachCounter).to.equal(1);
        expect(this.result.afterEachCounter).to.equal(0);
        expect(this.result.afterAllCounter).to.equal(0);
      }

      @Test('test2')
      test2() {
        expect(this.result.beforeAllCounter).to.equal(1);
        expect(this.result.beforeEachCounter).to.equal(2);
        expect(this.result.afterEachCounter).to.equal(1);
        expect(this.result.afterAllCounter).to.equal(0);
      }
    }

    const runner = new CourseRunner([SampleCourse]);
    const res = await runner.test<SampleCourseRes>('sample-course', '01-test-lesson', []);
    expect(res.beforeAllCounter).to.equal(1);
    expect(res.beforeEachCounter).to.equal(2);
    expect(res.afterEachCounter).to.equal(2);
    expect(res.afterAllCounter).to.equal(1);
  });

  it('course - beforeAll, beforeEach, afterEach and afterAll', async () => {
    interface SampleCourseRes extends TTestResponse {
      beforeAllCounter: number;
      beforeEachCounter: number;
      afterEachCounter: number;
      afterAllCounter: number;
    }

    @Course('sample-course')
    class SampleCourse extends CourseBase<unknown, SampleCourseRes> {
      lessons = [SampleLesson];

      async beforeAll() {
        this.result.beforeAllCounter = 0;
        this.result.beforeEachCounter = 0;
        this.result.afterEachCounter = 0;
        this.result.afterAllCounter = 0;

        this.result.beforeAllCounter++;
      }
      async beforeEach() {
        this.result.beforeEachCounter++;
      }
      async afterEach() {
        this.result.afterEachCounter++;
      }
      async afterAll() {
        this.result.afterAllCounter++;
      }
    }
    @Lesson('01-test-lesson')
    class SampleLesson extends LessonBase<unknown, SampleCourseRes> {
      @Test('test1')
      test1() {
        expect(this.result.beforeAllCounter).to.equal(1);
        expect(this.result.beforeEachCounter).to.equal(1);
        expect(this.result.afterEachCounter).to.equal(0);
        expect(this.result.afterAllCounter).to.equal(0);
      }

      @Test('test2')
      test2() {
        expect(this.result.beforeAllCounter).to.equal(1);
        expect(this.result.beforeEachCounter).to.equal(2);
        expect(this.result.afterEachCounter).to.equal(1);
        expect(this.result.afterAllCounter).to.equal(0);
      }
    }

    const runner = new CourseRunner([SampleCourse]);
    const res = await runner.test<SampleCourseRes>('sample-course', '01-test-lesson', []);
    expect(res.beforeAllCounter).to.equal(1);
    expect(res.beforeEachCounter).to.equal(2);
    expect(res.afterEachCounter).to.equal(2);
    expect(res.afterAllCounter).to.equal(1);
  });

  it('course - beforeAll assertions', async () => {
    @Course('sample-course')
    class SampleCourse extends CourseBase {
      lessons = [SampleLesson];
    }
    @Lesson('01-test-lesson')
    class SampleLesson extends LessonBase {
      async beforeAll() {
        expect.fail('assertion fail in beforeAll');
      }

      @Test('test1')
      test1() {
        expect.fail('should not get here');
      }

      @Test('test2')
      test2() {
        expect.fail('should not get here');
      }
    }

    const runner = new CourseRunner([SampleCourse]);
    const res = await runner.test('sample-course', '01-test-lesson', []);
    expect(res).to.deep.equal({ passed: false, tests: [], error: 'assertion fail in beforeAll' });
    console.debug(res);
  });

  it('course - beforeEach assertions', async () => {
    @Course('sample-course')
    class SampleCourse extends CourseBase {
      lessons = [SampleLesson];
    }
    @Lesson('01-test-lesson')
    class SampleLesson extends LessonBase {
      async beforeEach() {
        expect.fail('assertion fail in beforeEach');
      }

      @Test('test1')
      test1() {
        expect.fail('should not get here');
      }

      @Test('test2')
      test2() {
        expect.fail('should not get here');
      }
    }

    const runner = new CourseRunner([SampleCourse]);
    const res = await runner.test('sample-course', '01-test-lesson', []);

    expect(res).to.deep.equal({
      passed: false,
      tests: [
        { title: 'test1', passed: false, error: 'assertion fail in beforeEach' },
        { title: 'test2', passed: false, error: 'assertion fail in beforeEach' },
      ],
    });
  });

  it('afterEach and afterAll should run even if test fails', async () => {
    const afterEachFake = sinon.fake();
    const afterAllFake = sinon.fake();

    @Course('sample-course')
    class SampleCourse extends CourseBase {
      lessons = [SampleLesson];
    }
    @Lesson('01-test-lesson')
    class SampleLesson extends LessonBase {
      afterEach = afterEachFake;
      afterAll = afterAllFake;

      @Test('test1')
      test1() {
        expect.fail('test1 failure');
      }

      @Test('test2')
      test2() {
        expect.fail('test2 failure');
      }
    }

    const runner = new CourseRunner([SampleCourse]);
    const res = await runner.test('sample-course', '01-test-lesson', []);
    expect(afterEachFake.callCount).to.equal(2, 'afterEachFake should have been called twice');
    expect(afterAllFake.callCount).to.equal(1, 'afterAllFake should have been called once');
  });

  it('actions', async () => {
    const courseActionFake = sinon.fake();
    const lessonActionFake = sinon.fake();

    type TSampleActionReq = { in: string };
    type TSampleActionRes = { out: string };

    @Course('sample-course')
    class SampleCourse extends CourseBase {
      lessons = [SampleLesson];

      @Action('courseAction')
      async courseAction(req: TActionRequest<TSampleActionReq>): Promise<TSampleActionRes> {
        courseActionFake();
        return { out: req.args.in };
      }
    }
    @Lesson('01-test-lesson')
    class SampleLesson extends LessonBase {
      @Action('lessonAction')
      async lessonAction(req: TActionRequest<TSampleActionReq>): Promise<TSampleActionRes> {
        lessonActionFake();
        return { out: req.args.in };
      }

      @Action('errorAction')
      async errorAction(req: TActionRequest<TSampleActionReq>): Promise<TSampleActionRes> {
        throw new Error('Test error');
      }
    }

    const runner = new CourseRunner([SampleCourse]);
    let req: TActionRequest<TSampleActionReq> = {
      runner: 'test',
      courseSlug: 'sample-course',
      // note that for course action, lesson slug can be anything
      lessonSlug: 'xxx',
      action: 'courseAction',
      files: [],
      args: {
        in: 'test',
      },
    };

    let res = await runner.action<TSampleActionRes>(req);
    expect(res.body).to.deep.equal({ out: 'test' });
    expect(res.error).to.be.undefined;
    expect(courseActionFake.callCount).to.equal(1);

    req = {
      runner: 'test',
      courseSlug: 'sample-course',
      lessonSlug: '01-test-lesson',
      action: 'lessonAction',
      files: [],
      args: {
        in: 'test',
      },
    };

    res = await runner.action(req);
    expect(res.body).to.deep.equal({ out: 'test' });
    expect(res.error).to.be.undefined;
    expect(lessonActionFake.callCount).to.equal(1);

    req = {
      runner: 'test',
      courseSlug: 'sample-course',
      lessonSlug: '01-test-lesson',
      action: 'errorAction',
      files: [],
      args: {
        in: 'test',
      },
    };
    res = await runner.action(req);
    expect(res.body).to.be.undefined;
    expect(res.error).to.equal('Test error');
  });
});
