import { TEditorFileMap, TTestResponse } from '../types';
import chai from 'chai';
import { CourseMetadata } from './CourseMetadata';

export { expect } from 'chai';

chai.config.truncateThreshold = 0;

export abstract class CourseBase<CTX = unknown, RES extends TTestResponse = TTestResponse> {
  files: TEditorFileMap;
  context: CTX;
  result: RES;

  abstract readonly lessons: (new () => LessonBase)[];
}

export interface CourseBase<CTX = unknown, RES extends TTestResponse = TTestResponse> {
  beforeAll?(): Promise<void>;
  beforeEach?(): Promise<void>;
  afterEach?(): Promise<void>;
  afterAll?(): Promise<void>;
}

export abstract class LessonBase<CTX = unknown, RES extends TTestResponse = TTestResponse> {
  files: TEditorFileMap;
  context: CTX;
  result: RES;
}

export interface LessonBase<CTX = unknown, RES extends TTestResponse = TTestResponse> {
  beforeAll?(): Promise<void>;
  beforeEach?(): Promise<void>;
  afterEach?(): Promise<void>;
  afterAll?(): Promise<void>;
}

// decorators
export function Course(slug: string, opts?: { timeout?: number; only?: boolean; skip?: boolean }) {
  return function courseDecorator(constructor: new () => CourseBase) {
    const { timeout, only, skip } = opts || {};
    CourseMetadata.setCourseMeta(constructor, {
      constructor,
      slug,
      lessons: [],
      timeout,
      only,
      skip,
    });
  };
}

Course.only = function (slug: string, opts?: { timeout?: number }) {
  return Course(slug, { ...opts, only: true });
};

Course.skip = function (slug: string, opts?: { timeout?: number }) {
  return Course(slug, { ...opts, skip: true });
};

export function Lesson(slug: string, opts?: { timeout?: number; only?: boolean; skip?: boolean }) {
  return function lessonDecorator(constructor: new () => LessonBase) {
    const { timeout, only, skip } = opts || {};
    CourseMetadata.setLessonMeta(constructor, { constructor, slug, timeout, only, skip });
  };
}

Lesson.only = function (slug: string, opts?: { timeout?: number }) {
  return Lesson(slug, { ...opts, only: true });
};

Lesson.skip = function (slug: string, opts?: { timeout?: number }) {
  return Lesson(slug, { ...opts, skip: true });
};

export function Test(title: string, opts?: { timeout?: number; only?: boolean; skip?: boolean }) {
  return function testDecorator(target: any, methodName: string, descriptor: PropertyDescriptor) {
    const { timeout, only, skip } = opts || {};
    CourseMetadata.setTestMeta(descriptor.value, {
      title,
      fn: descriptor.value,
      timeout,
      only,
      skip,
    });
  };
}

Test.only = function (title: string, opts?: { timeout?: number }) {
  return Test(title, { ...opts, only: true });
};

Test.skip = function (title: string, opts?: { timeout?: number }) {
  return Test(title, { ...opts, skip: true });
};

export function Passes(title: string, files: TEditorFileMap, resultMatch?: any) {
  return function passesDecorator(
    target: any,
    methodName?: string,
    descriptor?: PropertyDescriptor,
  ) {
    // Check if it's a class decorator
    if (!methodName && !descriptor) {
      CourseMetadata.addCheck(target, { kind: 'passes', name: title, files, resultMatch });
      return;
    }

    // Else, it's a method decorator
    CourseMetadata.addCheck(descriptor.value, { kind: 'passes', name: title, files });
  };
}

export function Fails(title: string, files: TEditorFileMap, match: string) {
  return function failsDecorator(
    target: any,
    methodName?: string,
    descriptor?: PropertyDescriptor,
  ) {
    // Check if it's a class decorator
    if (!methodName && !descriptor) {
      CourseMetadata.addCheck(target, { kind: 'fails', name: title, files, match });
      return;
    }

    // Else, it's a method decorator
    CourseMetadata.addCheck(descriptor.value, { kind: 'fails', name: title, files, match });
  };
}

export function Action(name: string) {
  return function actionDecorator(target: any, methodName: string, descriptor: PropertyDescriptor) {
    CourseMetadata.setActionMeta(descriptor.value, {
      name,
      fn: descriptor.value,
    });
  };
}
