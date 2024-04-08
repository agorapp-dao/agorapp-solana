import { IEditorPlugin, Monaco, TEditorFile } from '@agorapp-dao/editor-common';
import pkg from '../package.json';
import { TCourseType } from '@agorapp-dao/content-common';
import { TTestResponse } from '@agorapp-dao/editor-common/src/types/TTestResponse';
import { TTestRequest } from '@agorapp-dao/editor-common/src/types/TTestRequest';

export default class SolanaEditorPlugin implements IEditorPlugin {
  name = pkg.name;

  fileExtensions = {
    rs: 'rust',
  };

  private monaco: Monaco | undefined;

  async init(monaco: Monaco) {
    this.monaco = monaco;
  }

  async run(
    courseSlug: string,
    lessonSlug: string | undefined,
    files: TEditorFile[],
  ): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async test(
    courseType: TCourseType,
    courseSlug: string,
    lessonSlug: string | undefined,
    files: TEditorFile[],
  ): Promise<TTestResponse> {
    const req: TTestRequest = {
      runner: 'solana',
      courseSlug,
      lessonSlug,
      files,
    };

    const response = await fetch('/next-api/runner/solve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });
    const res = await response.json();
    return res;
  }

  async check(filePath: string, files: TEditorFile[]): Promise<void> {
    const monaco = this.monaco;
    if (!monaco) {
      return;
    }
  }
}
