import { TEditorFile } from './TEditorFile';
import { TCourseType } from '@agorapp-dao/content-common';

export type TTestRequest = {
  runner: string;
  type?: TCourseType;
  courseSlug: string;
  lessonSlug?: string;

  files: TEditorFile[];

  // docker-runner args
  image?: string;

  // TODO: needed for django
  course_slug?: string;
  lesson_slug?: string;
};
