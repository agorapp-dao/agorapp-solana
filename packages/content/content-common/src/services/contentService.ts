import fsp from 'fs/promises';
import path from 'path';
import { TCourse } from '../types/TCourse';
import { ECourseChain } from '../types/ECourseChain';
import { ECourseLanguage } from '../types/ECourseLanguage';

// get public content dir
const contentDir = path.join(process.cwd(), 'public/content2');

// get root of the content-common package
class ContentService {
  /**
   * Gets information about the course from the static resources by reading the course.json file
   * directly from the file system. Useful for pre-rendering.
   */
  async getCourseFromFile(
    chain: ECourseChain,
    language: ECourseLanguage,
    courseSlug: string,
  ): Promise<TCourse | undefined> {
    const courseJsonPath = path.join(
      contentDir,
      `content-${encodeURIComponent(chain)}-${encodeURIComponent(language)}-${encodeURIComponent(
        courseSlug,
      )}`,
      'course.json',
    );

    try {
      const courseJson = await fsp.readFile(courseJsonPath, 'utf-8');
      return JSON.parse(courseJson);
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        return undefined;
      }
      console.error(`Error loading course.json from ${courseJsonPath}`);
      throw err;
    }
  }

  /**
   * Gets course content from the static resources by reading the file
   * directly from the file system. Useful for pre-rendering.
   * @param course
   * @param contentPath
   */
  async getContentFromFile(course: TCourse, contentPath: string): Promise<string> {
    const fullPath = path.join(
      contentDir,
      `content-${encodeURIComponent(course.chain)}-${course.language}-${encodeURIComponent(
        course.slug,
      )}`,
      contentPath,
    );

    try {
      const content = await fsp.readFile(fullPath, 'utf-8');
      return content;
    } catch (err: any) {
      console.error(`Error loading ${fullPath}`);
      throw err;
    }
  }

  async listContentPackages(): Promise<TCourse[]> {
    const courses: TCourse[] = [];

    const dirs = await fsp.readdir(contentDir);
    for (const dir of dirs) {
      if (dir === 'content-common') {
        continue;
      }

      const jsonPath = path.join(contentDir, dir, 'course.json');
      try {
        const course = await fsp.readFile(jsonPath, 'utf-8');
        courses.push(JSON.parse(course));
      } catch (err: any) {
        console.warn(`Error loading ${jsonPath}: ${err.code} ${err.message}`);
      }
    }

    return courses;
  }
}

export const contentService = new ContentService();
