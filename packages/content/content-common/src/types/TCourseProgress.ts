import { TLesson } from './TCourse';

export type TCourseProgress = { [lessonSlug: string]: TLessonProgress };

export type TLessonProgress = {
  status: string;
};
