export type TEditorConfig = {
  topOffset?: number;
  enableLessonsWithProgress?: boolean;
  authenticated?: boolean;
  hideAuthor?: boolean;
  onLessonComplete?: (data: TEditorConfigOnLessonCompleteProps) => Promise<void>;
};

export type TEditorConfigOnLessonCompleteProps = {
  lessonNumber: string | undefined;
  isPrevLesson: boolean;
  isNextLesson: boolean;
  gas?: number;
};
