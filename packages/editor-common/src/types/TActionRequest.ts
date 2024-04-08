import { TEditorFile } from './TEditorFile';

export type TActionRequest<ARGS = unknown> = {
  runner: string;
  image?: string;
  action: string;
  courseSlug: string;
  lessonSlug?: string;

  files: TEditorFile[];

  args?: ARGS;
};
