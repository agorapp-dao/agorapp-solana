import { ECourseChain, ECourseLanguage, TCourse } from '@agorapp-dao/content-common';
import { courseService } from './courseService';

const COURSE: TCourse = {
  slug: 'motoko-tutorial',
  name: 'Motoko Tutorial',
  chain: ECourseChain.ETHEREUM,
  language: ECourseLanguage.SOLIDITY,
  description: 'Learn Motoko',
  type: 'tutorial',
  plugin: '@agorapp-dao/editor-plugin-motoko',
  config: {
    output: true,
  },
  lessons: [
    {
      name: 'Introduction',
      slug: 'introduction',
      content: '/motoko-tutorial/01-introduction/theory.md',
      files: ['/motoko-tutorial/01-introduction/main.mo'],
    },
    {
      name: 'Basics',
      slug: 'basics',
      children: [
        {
          name: 'Printing values',
          slug: 'printing-values',
          content: '/motoko-tutorial/02-basics/print-values/theory.md',
          files: [
            '/motoko-tutorial/02-basics/print-values/main.mo',
            '/motoko-tutorial/02-basics/print-values/folder1/some.mo',
            '/motoko-tutorial/02-basics/print-values/folder2/other.mo',
          ],
          solution: '/motoko-tutorial/02-basics/print-values/solution.md',
        },
        {
          name: 'Mutable variables',
          slug: 'mutable-variables',
          content: '/motoko-tutorial/02-basics/mutable-variables/theory.md',
          files: ['/motoko-tutorial/02-basics/mutable-variables/main.mo'],
          solution: '/motoko-tutorial/02-basics/mutable-variables/solution.md',
        },
        {
          name: 'Assigning values',
          slug: 'assigning-values',
        },
      ],
    },
    {
      name: 'Types',
      slug: 'types',
      children: [
        {
          name: 'Primitive types',
          slug: 'primitive-types',
          content: '/motoko-tutorial/02-basics/immutable-variables/theory.md',
          files: ['/motoko-tutorial/02-basics/immutable-variables/main.mo'],
          solution: '/motoko-tutorial/02-basics/immutable-variables/solution.md',
        },
      ],
    },
  ],
};

describe('courseService', () => {
  beforeEach(() => {
    courseService.fetchContent = jest.fn(
      async (course, contentPath) => `content of ${contentPath}`,
    );
  });

  test('find next lesson 1', () => {
    const res = courseService.nextLesson(COURSE, 'introduction');
    expect(res?.slug).toEqual('printing-values');
  });

  test('find next lesson 2', () => {
    const res = courseService.nextLesson(COURSE, 'printing-values');
    expect(res?.slug).toEqual('mutable-variables');
  });

  test('find next lesson 3', () => {
    const res = courseService.nextLesson(COURSE, 'mutable-variables');
    expect(res?.slug).toEqual('primitive-types');
  });

  test('find prev lesson 1', () => {
    const res = courseService.prevLesson(COURSE, 'primitive-types');
    expect(res?.slug).toEqual('mutable-variables');
  });

  test('find prev lesson 2', () => {
    const res = courseService.prevLesson(COURSE, 'mutable-variables');
    expect(res?.slug).toEqual('printing-values');
  });

  test('find prev lesson 3', () => {
    const res = courseService.prevLesson(COURSE, 'printing-values');
    expect(res?.slug).toEqual('introduction');
  });

  test('get lesson files 1', async () => {
    const res = await courseService.getLessonFiles(COURSE, 'introduction');
    expect(res[0]).toEqual({
      path: 'main.mo',
      content: 'content of /motoko-tutorial/01-introduction/main.mo',
    });
    expect(res.length).toEqual(1);
  });

  test('get lesson files 2', async () => {
    const res = await courseService.getLessonFiles(COURSE, 'printing-values');
    expect(res[0]).toEqual({
      path: 'main.mo',
      content: 'content of /motoko-tutorial/02-basics/print-values/main.mo',
    });
    expect(res[1]).toEqual({
      path: 'folder1/some.mo',
      content: 'content of /motoko-tutorial/02-basics/print-values/folder1/some.mo',
    });
    expect(res[2]).toEqual({
      path: 'folder2/other.mo',
      content: 'content of /motoko-tutorial/02-basics/print-values/folder2/other.mo',
    });
    expect(res.length).toEqual(3);
  });

  test('get common root of files', () => {
    const res = courseService._findCommonRoot([
      '02-basics/print-values/main.mo',
      '02-basics/print-values/folder1/some.mo',
      '02-basics/print-values/folder2/other.mo',
    ]);
    expect(res).toEqual(22);
  });
});
