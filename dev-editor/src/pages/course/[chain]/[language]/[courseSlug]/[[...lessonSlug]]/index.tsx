import { SWRConfig } from 'swr';
import * as S from '@/src/styles/global.styled';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { courseService, Editor, editorService } from '@agorapp-dao/editor-common';
import {
  ECourseChain,
  ECourseLanguage,
  parseCourseChain,
  parseCourseLanguage,
} from '@agorapp-dao/content-common';
import { EColorMode } from '@agorapp-dao/react-common/src/types/misc';
import { contentService } from '@agorapp-dao/content-common/src/services/contentService';

type TEditorPageProps = {
  chain: ECourseChain;
  language: ECourseLanguage;
  lessonSlug: string;
  courseSlug: string;
  fallback: { [key: string]: any };
};

courseService.baseUrl = '/course';

editorService.pluginLoader = async (pluginName: string) => {
  let pluginModule;
  switch (pluginName) {
    case '@agorapp-dao/editor-plugin-solana':
      pluginModule = await import('@agorapp-dao/editor-plugin-solana');
      break;

    default:
      throw new Error(`Plugin ${pluginName} not found`);
  }
  return pluginModule.default;
};

export default function EditorPage({
  chain,
  language,
  courseSlug,
  lessonSlug,
  fallback,
}: TEditorPageProps) {
  return (
    <SWRConfig value={{ fallback }}>
      <S.Main>
        <Editor
          chain={chain}
          language={language}
          courseSlug={courseSlug}
          activeLessonSlug={lessonSlug}
          colorMode={EColorMode.dark}
        />
      </S.Main>
    </SWRConfig>
  );
}

type TEditorPageParams = {
  chain: string;
  language: string;
  courseSlug: string;
  lessonSlug: string[];
};

export async function getServerSideProps(
  ctx: GetServerSidePropsContext<TEditorPageParams>,
): Promise<GetServerSidePropsResult<TEditorPageProps>> {
  if (!ctx.params) {
    throw new Error('No params provided');
  }

  const chain = parseCourseChain(ctx.params.chain);
  const language = parseCourseLanguage(ctx.params.language);
  const { courseSlug } = ctx.params;

  const fallback: { [key: string]: any } = {};

  const course = await contentService.getCourseFromFile(chain, language, courseSlug);
  if (!course) {
    throw new Error(`Course ${courseSlug} not found`);
  }
  const courseJsonPath = courseService.getContentPath(course, 'course.json');
  if (!courseJsonPath) {
    throw new Error(`Course ${courseSlug}: course.json not found`);
  }
  fallback[courseJsonPath] = course;

  let lessonSlug = ctx.params.lessonSlug?.length ? ctx.params.lessonSlug[0] : undefined;
  if (!lessonSlug) {
    const firstLesson = courseService.findLesson(course, lesson => !!lesson.content);
    if (!firstLesson) {
      throw new Error(`Course ${course.slug}: no lesson with content found`);
    }
    return {
      redirect: {
        permanent: false,
        destination: courseService.getCoursePath(course, firstLesson.slug),
      },
    };
  }

  const lesson = courseService.findLessonBySlug(course, lessonSlug);
  if (lesson?.content) {
    const contentPath = courseService.getContentPath(course, lesson.content);
    if (contentPath) {
      fallback[contentPath] = await contentService.getContentFromFile(course, lesson.content);
    }
  }

  return {
    props: { chain, language, courseSlug: ctx.params.courseSlug, lessonSlug, fallback },
  };
}
