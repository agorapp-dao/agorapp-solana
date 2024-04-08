import { ETopic } from './ETopic';
import { ECourseChain } from './ECourseChain';
import { ECourseLanguage } from './ECourseLanguage';

export type TCourseType = 'course' | 'challenge' | 'tutorial';

export type TCourse<T = unknown> = {
  chain: ECourseChain;
  language: ECourseLanguage;
  slug: string;
  name: string;
  description: string;
  type: TCourseType;
  plugin: string;
  pluginConfig?: T;

  config: TCourseConfig;

  lessons: TLesson[];
};

export type TLesson<T = unknown> = {
  name: string;
  slug?: string; // slug is optional for challenges, where there is only 1 lesson

  children?: TLesson[];

  content?: string;
  files?: string[];
  solution?: string;
  hints?: string[];

  /**
   * When set, this file will be active by default when switching to the lesson.
   */
  defaultFile?: string;

  /**
   * Computed property. Frontend will calculate this.
   */
  $lessonNumber?: string;

  pluginConfig?: T;
};

export type TCourseConfig = {
  output?: boolean;
  tests?: boolean;
  enableLessonsWithProgress?: boolean;

  actions?: string[];
};
