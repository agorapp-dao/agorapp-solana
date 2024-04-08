import { IEditorPlugin } from '../types/IEditorPlugin';
import { TEditorFile } from '../types/TEditorFile';
import { TTestResponse } from '../types/TTestResponse';
import { TCourseType } from '@agorapp-dao/content-common';

export type PluginLoader = (pluginName: string) => Promise<new () => IEditorPlugin>;

const emptyPluginLoader: PluginLoader = async pluginName => {
  throw new Error(
    `Cannot load plugin ${pluginName}. No pluginLoader has been provided. Set editorService.pluginLoader first.`,
  );
};

class EditorService {
  pluginLoader: PluginLoader = emptyPluginLoader;

  registerPlugin(plugin: IEditorPlugin) {
    for (const ext of Object.keys(plugin.fileExtensions)) {
      const lang = plugin.fileExtensions[ext];
    }
  }

  getLanguageForFile(plugin: IEditorPlugin, filePath: string): string {
    const fileExtension = filePath.split('.').pop();
    return fileExtension ? plugin.fileExtensions[fileExtension] : 'text/plain';
  }

  async run(
    plugin: IEditorPlugin,
    courseSlug: string,
    lessonSlug: string | undefined,
    files: TEditorFile[],
  ): Promise<string> {
    const output = await plugin.run(courseSlug, lessonSlug, files);
    return output;
  }

  async test(
    plugin: IEditorPlugin,
    courseType: TCourseType,
    courseSlug: string,
    lessonSlug: string | undefined,
    files: TEditorFile[],
  ): Promise<TTestResponse> {
    const res = await plugin.test(courseType, courseSlug, lessonSlug, files);
    return res;
  }

  async check(plugin: IEditorPlugin, filePath: string, files: TEditorFile[]): Promise<void> {
    await plugin.check(filePath, files);
  }
}

export const editorService = new EditorService();
