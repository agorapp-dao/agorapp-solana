import { TEditorFile, TEditorFileMap } from '../types';
import fs from 'fs/promises';
import path from 'path';
import mockRequire from 'mock-require';

/**
 * Manages directory with a user-provided code. Code is stored at the local disk, and you can
 * import JavaScript modules from it by using the `import` method.
 *
 * Note that imports are cached by the Node.js runtime, so if code on the disk changes, you might
 * have to call the `invalidateRequireCache` method.
 *
 * TODO: Built on top of CommonJS, won't work with ES modules.
 * To use ES modules, move to testdouble npm package
 */
export class JavaScriptUserspace {
  static async create(files?: TEditorFileMap) {
    files = files || {};

    const instance = new JavaScriptUserspace();

    await fs.rm('userspace/code', { recursive: true, force: true });
    await fs.mkdir('userspace/code', { recursive: true });

    for (const filePath of Object.keys(files)) {
      await instance.addFile(filePath, files[filePath].content);
    }

    return instance;
  }

  private constructor() {
    // nothing to do here
  }

  async addFile(filePath: string, content: string) {
    const userspacePath = path.resolve('userspace/code');
    filePath = path.normalize(path.join(userspacePath, filePath));

    if (!filePath.startsWith(userspacePath)) {
      throw new Error(`Path ${filePath} resolves to outside of the userspace directory`);
    }

    await fs.writeFile(filePath, content, 'utf-8');
  }

  async import(modulePath: string): Promise<any> {
    modulePath = path.resolve(`userspace/code/${modulePath}`);
    return import(modulePath);
  }

  mockModule(modulePath: string, moduleMock: any) {
    mockRequire(modulePath, moduleMock);
  }

  invalidateRequireCache() {
    for (const module of Object.keys(require.cache)) {
      if (module.includes('userspace')) {
        delete require.cache[module];
      }
    }
  }
}
