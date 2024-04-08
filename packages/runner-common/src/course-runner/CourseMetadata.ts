import { CourseBase, LessonBase } from './course';
import { TEditorFileMap } from '../types';

export const courseMetaKey = Symbol('courseMeta');
export const lessonMetaKey = Symbol('lessonMeta');
export const testMetaKey = Symbol('testMeta');
export const actionMetaKey = Symbol('testMeta');

export const checkMetaKey = Symbol('checkMeta');

export type TCourseMeta = {
  constructor: new () => CourseBase;
  slug: string;
  lessons: (new () => LessonBase)[];
  timeout?: number;
  only?: boolean;
  skip?: boolean;
};

export type TLessonMeta = {
  constructor: new () => LessonBase;
  slug: string;
  timeout?: number;
  only?: boolean;
  skip?: boolean;
};

export type TTestMeta = {
  title: string;
  fn: () => void;
  timeout?: number;
  only?: boolean;
  skip?: boolean;
};

export type TActionMeta = {
  name: string;
  fn: () => void;
};

export type TCheckMeta = {
  checks: TCheck[];
};

export type TCheck = {
  kind: 'passes' | 'fails';
  name: string;
  files: TEditorFileMap;
  match?: string;
  resultMatch?: any;
  only?: boolean;
  skip?: boolean;
};

export class CourseMetadata {
  static setCourseMeta(courseConstructor: new () => CourseBase, meta: TCourseMeta) {
    (courseConstructor as any)[courseMetaKey] = meta;
  }

  static getCourseMeta(courseConstructor: new () => CourseBase): TCourseMeta {
    return (courseConstructor as any)[courseMetaKey] as TCourseMeta;
  }

  static setLessonMeta(lessonConstructor: new () => LessonBase, meta: TLessonMeta) {
    (lessonConstructor as any)[lessonMetaKey] = meta;
  }

  static getLessonMeta(lessonConstructor: new () => LessonBase): TLessonMeta {
    return (lessonConstructor as any)[lessonMetaKey] as TLessonMeta;
  }

  static getLessons(courseMeta: TCourseMeta): TLessonMeta[] {
    const lessons = new courseMeta.constructor().lessons;
    return lessons.map(lessonConstructor => this.getLessonMeta(lessonConstructor));
  }

  static setTestMeta(method: any, meta: TTestMeta) {
    method[testMetaKey] = meta;
  }

  static getTests(lesson: LessonBase): TTestMeta[] {
    const members = Object.getOwnPropertyNames(Object.getPrototypeOf(lesson));
    return members
      .map(member => (lesson as any)[member] && (lesson as any)[member][testMetaKey])
      .filter((test: TTestMeta) => !!test);
  }

  static setActionMeta(method: any, meta: TActionMeta) {
    method[actionMetaKey] = meta;
  }

  static getActions(lessonOrCourse: LessonBase | CourseBase): TActionMeta[] {
    if (!lessonOrCourse) return [];
    const members = Object.getOwnPropertyNames(Object.getPrototypeOf(lessonOrCourse));
    return members
      .map(
        member => (lessonOrCourse as any)[member] && (lessonOrCourse as any)[member][actionMetaKey],
      )
      .filter((action: TActionMeta) => !!action);
  }

  static addCheck(target: any, check: TCheck) {
    let meta: TCheckMeta = target[checkMetaKey];
    if (!meta) {
      meta = {
        checks: [],
      };
    }
    meta.checks.push(check);
    target[checkMetaKey] = meta;
  }

  static getLessonChecks(lesson: TLessonMeta): TCheck[] {
    return (lesson.constructor as any)[checkMetaKey]?.checks || [];
  }

  static getTestChecks(test: TTestMeta): TCheck[] {
    return (test.fn as any)[checkMetaKey]?.checks || [];
  }
}
