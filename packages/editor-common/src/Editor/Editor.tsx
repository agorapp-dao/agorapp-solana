'use client';

import * as S from './Editor.styled';
import SplitPane, { Pane, SashContent } from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css';
import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { courseService } from '../services/courseService';
import { SectionTabs } from './SectionTabs/SectionTabs';
import { LessonHeader } from './LessonHeader/LessonHeader';
import { ContentLevel } from './ContentItem/ContentLevel';
import { EEditorSectionType } from '../constants';
import { SectionLesson } from './Section/Lesson/SectionLesson';
import { SectionCode } from './Section/Code/SectionCode';
import { ControlPanel } from './ControlPanel/ControlPanel';
import { BottomPanel } from './BottomPanel/BottomPanel';
import { monacoDefineTheme, useMonaco } from './Monaco/Monaco';
import { TEditorTab } from '../types/TEditorTab';
import { editorService } from './editorService';
import type { editor } from 'monaco-editor';
import { useMobile } from '../hooks/useMobile';
import { EditorStoreProvider, useEditorActions, useEditorStore } from './EditorStore';
import { useEditorPlugin } from './Monaco/useEditorPlugin';
import { TEditorConfig } from '../types/TEditorConfig';
import {
  darkColors,
  EAnalyticsActions,
  EAnalyticsCategories,
  lightColors,
  UserAnalytics,
} from '@agorapp-dao/react-common';
import { OverlayWithLessonHeader } from './OverlayWithLessonHeader/OverlayWithLessonHeader';
import AgDialogProvider from '@agorapp-dao/react-common/src/components/AgDialogProvider';
import { Tree } from './Tree/Tree';
import { EColorMode } from '@agorapp-dao/react-common/src/types/misc';
import { ECourseChain, ECourseLanguage } from '@agorapp-dao/content-common';

type EditorProps = {
  chain: ECourseChain;
  language: ECourseLanguage;
  courseSlug: string;
  activeLessonSlug: string;
  apiUrl?: string;
  config?: TEditorConfig;
  authenticated?: boolean;
  colorMode?: EColorMode;
  headerContent?: React.ReactNode;
};

const THEORY_DEFAULT_WIDTH = 600;
const CODE_DEFAULT_HEIGHT = 400;
const SIDE_PANEL_DEFAULT_WIDTH = 300;
const BOTTOM_PANEL_DEFAULT_HEIGHT = 200;

monacoDefineTheme(
  {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'custom-info', foreground: 'a3a7a9', background: 'ffffff' },
      { token: 'custom-error', foreground: 'ee4444' },
      { token: 'custom-notice', foreground: '1055af' },
      { token: 'custom-date', foreground: '20aa20' },
    ],
    colors: {
      'editor.foreground': darkColors.textPrimary,
      'editor.background': darkColors.bg,
    },
  },
  {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'custom-info', foreground: 'a3a7a9', background: 'ffffff' },
      { token: 'custom-error', foreground: 'ee4444' },
      { token: 'custom-notice', foreground: '1055af' },
      { token: 'custom-date', foreground: '20aa20' },
    ],
    colors: {
      'editor.foreground': lightColors.textPrimary,
      'editor.background': lightColors.bg,
    },
  },
);

export function Editor({
  chain,
  language,
  courseSlug,
  activeLessonSlug,
  apiUrl,
  config,
  authenticated,
  colorMode,
  headerContent,
}: EditorProps) {
  // inject missing config values
  let cfg = config || {};
  if (!cfg.topOffset) {
    cfg.topOffset = 0;
  }
  if (typeof cfg.enableLessonsWithProgress === 'undefined') {
    cfg.enableLessonsWithProgress = false;
  }

  return (
    <EditorStoreProvider
      chain={chain}
      language={language}
      courseSlug={courseSlug}
      activeLessonSlug={activeLessonSlug}
      apiUrl={apiUrl}
      config={cfg}
    >
      <AgDialogProvider>
        <EditorInner
          authenticated={authenticated}
          colorMode={colorMode === EColorMode.light ? EColorMode.light : EColorMode.dark}
          headerContent={headerContent}
        />
      </AgDialogProvider>
    </EditorStoreProvider>
  );
}

type TEditorInner = {
  authenticated?: boolean;
  colorMode: EColorMode;
  headerContent?: React.ReactNode;
};

function EditorInner({ authenticated, colorMode, headerContent }: TEditorInner) {
  const monaco = useMonaco();
  const plugin = useEditorPlugin();
  const [showListOfContents, setShowListOfContents] = useState(true);
  const store = useEditorStore();
  const actions = useEditorActions();

  const { mobile } = useMobile();
  const [panelSizeHorizontal, setPanelSizeHorizontal] = useState([
    THEORY_DEFAULT_WIDTH,
    Infinity,
    SIDE_PANEL_DEFAULT_WIDTH,
  ]);
  const [panelSizeVertical, setPanelSizeVertical] = useState([
    CODE_DEFAULT_HEIGHT,
    BOTTOM_PANEL_DEFAULT_HEIGHT,
  ]);
  const course = courseService.useCourse();
  const lessonSectionRef = useRef<HTMLDivElement>(null);
  const leftPanelElementRef = useRef<HTMLDivElement>(null);
  const lessonHeaderElementRef = useRef<HTMLDivElement>(null);

  // overload config if enableLessonsWithProgress is set directly as input prop of Editor component
  useEffect(() => {
    if (!store.config.enableLessonsWithProgress && course?.data?.config.enableLessonsWithProgress) {
      store.actions.setEnableLessonsWithProgress(true);
    }
  }, [store.actions, store.config, course]);

  useEffect(() => {
    setShowListOfContents(false);
  }, [store.currentSection]);

  useEffect(() => {
    store.actions.setAuthenticated(!!authenticated);
  }, [store.actions, authenticated]);

  useEffect(() => {
    store.actions.setHeaderContent(headerContent);
  }, [store.actions, headerContent]);

  useEffect(() => {
    store.actions.setColorMode(colorMode);
  }, [store.actions, colorMode]);

  useEffect(() => {
    if (mobile) {
      setPanelSizeHorizontal([0, Infinity, 0]);
      actions.setCurrentSection(EEditorSectionType.LESSON);
    } else {
      setPanelSizeHorizontal([
        THEORY_DEFAULT_WIDTH,
        Infinity,
        store?.sidePanels?.length > 0 ? SIDE_PANEL_DEFAULT_WIDTH : 0,
      ]);
      actions.setCurrentSection(EEditorSectionType.LESSON);
    }
  }, [mobile, setPanelSizeHorizontal, actions, store?.sidePanels]);

  const handleSelectLesson = (slug: string) => {
    setShowListOfContents(false);
  };

  useEffect(() => {
    let isMounted = true;
    let models: editor.ITextModel[] = [];

    const fetchFiles = async () => {
      if (!course.data || !store.activeLessonSlug || !monaco || !plugin) {
        return;
      }

      const files = await courseService.getLessonFiles(course.data, store.activeLessonSlug);

      if (isMounted) {
        const tabs: TEditorTab[] = files.map(file => ({
          path: file.path,
          model: monaco.editor.createModel(
            file.content,
            editorService.getLanguageForFile(plugin, file.path),
            monaco.Uri.from({ scheme: 'file', path: file.path }),
          ),
        }));
        actions.setFiles(files);
        actions.setTabs(tabs);

        const lesson = courseService.findLessonBySlug(course.data, store.activeLessonSlug);
        if (lesson?.defaultFile) {
          const tabIndex = tabs.findIndex(tab => tab.path.endsWith(lesson.defaultFile!));
          if (tabIndex !== -1) {
            actions.setActiveTab(tabIndex);
          }
        }

        models = tabs.map(tab => tab.model);
      }
    };

    fetchFiles();

    return () => {
      isMounted = false;
      models.forEach(model => model.dispose());
      actions.setTabs([]);
    };
  }, [course.data, store.activeLessonSlug, monaco, actions, plugin]);

  useEffect(() => {
    if (store.activeLessonSlug && lessonSectionRef.current) {
      lessonSectionRef.current?.scrollTo(0, 0);
    }
  }, [store.activeLessonSlug, lessonSectionRef]);

  const resetCode = async () => {
    if (!course.data || !store.activeLessonSlug || !monaco) {
      return;
    }
    const userAnalytics = new UserAnalytics();
    userAnalytics.sendGAEvent({
      category: EAnalyticsCategories.EDITOR,
      action: EAnalyticsActions.RESET_CODE,
    });
    const files = await courseService.getLessonFiles(course.data, store.activeLessonSlug);
    actions.setFiles(files);
    files.forEach(file => {
      store.tabs.find(tab => tab.path === file.path)?.model.setValue(file.content);
    });
  };

  if (!course.data) {
    return <div></div>;
  }

  const activeLesson = courseService.findLessonBySlug(course.data, store.activeLessonSlug);

  const lessonHeader = activeLesson && (
    <div ref={lessonHeaderElementRef}>
      <LessonHeader
        courseTitle={course.data.name}
        lessonTitle={activeLesson.name}
        lessonNumber={activeLesson.$lessonNumber}
        opened={store.currentSection === EEditorSectionType.TABLE_OF_CONTENTS}
        handleClick={() => {
          if (store.currentSection === EEditorSectionType.TABLE_OF_CONTENTS) {
            if (mobile) {
              actions.setCurrentSection(EEditorSectionType.CODE);
            } else {
              actions.setCurrentSection(EEditorSectionType.LESSON);
            }
          } else {
            actions.setCurrentSection(EEditorSectionType.TABLE_OF_CONTENTS);
          }
        }}
      />
    </div>
  );

  const activeSidePanel = store.sidePanels.length > 0 ? store.sidePanels[0] : null;

  const sidePanel = activeSidePanel && (
    <activeSidePanel.component {...(activeSidePanel.props as {})} />
  );

  const theorySection = (
    <S.Section>
      {!mobile && lessonHeader}
      <S.SectionContent>
        <div style={{ overflowY: 'auto' }} ref={lessonSectionRef}>
          <SectionLesson />
        </div>
      </S.SectionContent>
    </S.Section>
  );

  const treeSection = store.tabs.length > 1 && (
    <S.Section>
      {!mobile && lessonHeader}
      <S.SectionContent>
        <div style={{ overflowY: 'auto' }}>
          <Tree />
        </div>
      </S.SectionContent>
    </S.Section>
  );

  const listOfContents = (
    <S.ListOfContents>
      <ContentLevel
        lessons={course.data.lessons}
        level={1}
        handleSelectLesson={handleSelectLesson}
        enableLessonsWithProgress={store.config.enableLessonsWithProgress}
      />
    </S.ListOfContents>
  );

  return (
    <>
      <SectionTabs></SectionTabs>
      {mobile && store.currentSection === EEditorSectionType.LESSON && (
        <OverlayWithLessonHeader
          lessonHeader={lessonHeader}
          content={theorySection}
          offsetLeft={leftPanelElementRef.current?.offsetWidth}
        />
      )}
      {store.currentSection === EEditorSectionType.TABLE_OF_CONTENTS && (
        <OverlayWithLessonHeader
          lessonHeader={lessonHeader}
          content={listOfContents}
          offsetLeft={leftPanelElementRef.current?.offsetWidth}
        />
      )}
      {store.currentSection === EEditorSectionType.LOG && (
        <OverlayWithLessonHeader
          lessonHeader={lessonHeader}
          content={sidePanel}
          offsetLeft={leftPanelElementRef.current?.offsetWidth}
        />
      )}
      <S.Wrapper style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {mobile && lessonHeader}
        <SplitPane
          split="vertical"
          sizes={panelSizeHorizontal}
          onChange={setPanelSizeHorizontal}
          sashRender={(_, active) => (
            <SashContent
              active={active}
              type="vscode"
              className={`sash-wrap-line ${active ? 'active' : 'inactive'}`}
            >
              <span className="line" />
              <span />
            </SashContent>
          )}
        >
          <Pane minSize={500} maxSize="50%">
            <Box sx={{ display: 'flex', height: '100%' }} ref={leftPanelElementRef}>
              {!mobile && (
                <>
                  {store.currentSection === EEditorSectionType.LESSON && theorySection}
                  {store.currentSection === EEditorSectionType.TREE && treeSection}
                </>
              )}
            </Box>
          </Pane>
          <SplitPane
            sizes={panelSizeVertical}
            onChange={setPanelSizeVertical}
            split="horizontal"
            sashRender={(_, active) => (
              <SashContent
                active={active}
                type="vscode"
                className={`sash-wrap-line ${active ? 'active' : 'inactive'}`}
              >
                <span className="line" />
                <Box
                  sx={{
                    background: theme => theme.custom.splitPaneLine,
                    width: '50px',
                    height: '5px',
                    borderRadius: '5px',
                  }}
                ></Box>
                <span />
              </SashContent>
            )}
          >
            <Pane minSize={CODE_DEFAULT_HEIGHT} maxSize="80%">
              <S.RightPane sx={{ pl: { sm: 0, md: 4 } }}>
                <S.Code>
                  <SectionCode />
                </S.Code>
                <S.BottomPanel>
                  <ControlPanel handleResetCode={resetCode} />
                </S.BottomPanel>
              </S.RightPane>
            </Pane>
            <Pane>
              <BottomPanel />
            </Pane>
          </SplitPane>
          {!mobile && activeSidePanel ? (
            <Pane minSize={SIDE_PANEL_DEFAULT_WIDTH} maxSize="50%">
              {sidePanel}
            </Pane>
          ) : (
            <></>
          )}
        </SplitPane>
      </S.Wrapper>
    </>
  );
}
