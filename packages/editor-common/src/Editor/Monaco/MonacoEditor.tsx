import { useEffect, useRef, useState } from 'react';
import type { editor } from 'monaco-editor';
import * as S from './MonacoEditor.styled';
import { useMonaco } from './Monaco';
import { editorService } from '../editorService';
import { useEditorStore } from '../EditorStore';
import { courseService } from '../../services/courseService';
import { useEditorPlugin } from './useEditorPlugin';

export interface MonacoEditorProps {
  model?: editor.ITextModel;
}

export const MonacoEditor = ({ model }: MonacoEditorProps) => {
  const monaco = useMonaco();
  const plugin = useEditorPlugin();
  const [editor, setEditor] = useState<editor.IStandaloneCodeEditor | undefined>(undefined);
  const divEl = useRef<HTMLDivElement>(null);
  const store = useEditorStore();
  const course = courseService.useCourse();

  useEffect(() => {
    let editor: editor.IStandaloneCodeEditor;
    let isMounted = true;

    if (monaco && divEl.current) {
      editor = monaco.editor.create(divEl.current, {
        model: null,
        theme: store.colorMode,
        automaticLayout: true,
        fontSize: store.fontSize,
        minimap: {
          enabled: false,
        },
        scrollbar: {
          verticalScrollbarSize: 7,
        },
        tabSize: 2,
        suggest: {
          // Without this, the first suggestion won't be selected automatically when snippet is active
          // https://github.com/microsoft/vscode/issues/173387
          snippetsPreventQuickSuggestions: false,
        },
      });

      const e = editor as any;

      // TODO: https://github.com/microsoft/monaco-editor/issues/2000
      const editorService = e._codeEditorService;
      const openEditorBase = editorService.openCodeEditor.bind(editorService);
      editorService.openCodeEditor = async (input: any, source: any) => {
        const result = await openEditorBase(input, source);
        if (result === null) {
          const model = monaco.editor.getModel(input.resource);
          const newTab = store.tabs.findIndex(tab => tab.model === model);
          if (newTab) {
            store.actions.setActiveTab(newTab);
          }
        }
        return result; // always return the base result
      };

      setEditor(editor);
    }

    return () => {
      isMounted = false;
      editor?.dispose();
    };
  }, [monaco, divEl, store.fontSize, store.tabs, store.actions, store.colorMode]);

  useEffect(() => {
    if (editor) {
      editor.updateOptions({ theme: store.colorMode });
    }
  }, [editor, store.colorMode]);

  useEffect(() => {
    if (!editor || !model || !plugin) {
      return;
    }
    // TODO: keep view state, see https://github.com/Microsoft/monaco-editor/issues/604#issuecomment-344214706
    editor.setModel(model);
    if (plugin.onModelChange) {
      plugin.onModelChange();
    }
  }, [editor, model, plugin]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    let isMounted = true;

    let checkTimeout: any;

    const checkModelDebounced = () => {
      if (checkTimeout) {
        clearTimeout(checkTimeout);
      }
      checkTimeout = setTimeout(() => {
        if (!isMounted || !course.data || !plugin) {
          return;
        }

        // sync opened tab content with files in memory
        for (const tab of store.tabs) {
          const file = store.files.find(file => file.path === tab.path);
          if (!file) {
            throw new Error(`File for tab not found: ${tab.path}`);
          }
          if (!tab.model.isDisposed()) {
            file.content = tab.model.getValue();
          }
        }

        const tab = store.tabs[store.activeTab];

        editorService.check(plugin, tab.path, store.files);
      }, 300);

      return () => {
        isMounted = false;
        clearTimeout(checkTimeout);
      };
    };

    editor.onDidChangeModel(checkModelDebounced);
    editor.onDidChangeModelContent(checkModelDebounced);
    checkModelDebounced();
  }, [store.activeTab, editor, store.files, store.tabs, course.data, plugin]);

  return <S.Code ref={divEl} data-test="monaco-editor" />;
};
