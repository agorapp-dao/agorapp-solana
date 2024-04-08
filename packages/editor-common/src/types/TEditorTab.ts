import type { editor } from 'monaco-editor';

export type TEditorTab = {
  path: string;
  model: editor.ITextModel;
};
