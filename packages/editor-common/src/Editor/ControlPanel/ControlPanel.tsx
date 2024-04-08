import * as S from './ControlPanel.styled';
import React, { useEffect, useState } from 'react';
import { CircularProgress, IconButton } from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { TLesson } from '@agorapp-dao/content-common';
import { useRouter } from 'next/router';
import { courseService } from '../../services/courseService';
import { editorService } from '../editorService';
import { useEditorActions, useEditorStore } from '../EditorStore';
import { useEditorPlugin } from '../Monaco/useEditorPlugin';
import { AgButton } from '@agorapp-dao/react-common/src/components/AgButton';
import { EAnalyticsActions, EAnalyticsCategories, UserAnalytics } from '@agorapp-dao/react-common';
import { useMobile } from '../../hooks/useMobile';
import { OUTPUT_PANEL_ID, TEST_PANEL_ID } from '../BottomPanel/BottomPanel';

interface IControlPanelProps {
  handleResetCode: () => void;
}

export const ControlPanel = ({ handleResetCode }: IControlPanelProps) => {
  const router = useRouter();
  const plugin = useEditorPlugin();
  const store = useEditorStore();
  const editorActions = useEditorActions();
  const [running, setRunning] = useState(false);
  const [nextLesson, setNextLesson] = useState<TLesson | undefined>(undefined);
  const [prevLesson, setPrevLesson] = useState<TLesson | undefined>(undefined);
  const course = courseService.useCourse();
  const { progress, invalidateProgress } = courseService.useCourseProgress();
  const { mobile } = useMobile();

  const actions = course.data?.config?.actions || ['run'];

  useEffect(() => {
    if (course.data && store.activeLessonSlug) {
      setNextLesson(courseService.nextLesson(course.data, store.activeLessonSlug));
      setPrevLesson(courseService.prevLesson(course.data, store.activeLessonSlug));
    }
  }, [store.activeLessonSlug, course]);

  const handleRunCode = async () => {
    const userAnalytics = new UserAnalytics();
    userAnalytics.sendGAEvent({
      category: EAnalyticsCategories.EDITOR,
      action: EAnalyticsActions.RUN_CODE,
    });

    // TODO: ask what is the rationale behind this check
    if (!course.data) {
      return;
    }

    setRunning(true);
    try {
      for (const tab of store.tabs) {
        const file = store.files.find(f => f.path === tab.path);
        if (!file) {
          throw new Error(`File ${tab.path} not found`);
        }
        file.content = tab.model.getValue();
      }

      if (course.data.config.tests) {
        const res = await editorService.test(
          plugin!,
          course.data.type,
          store.courseSlug!,
          store.activeLessonSlug,
          store.files,
        );
        editorActions.setTestResults(res);
        if (res.passed && store.config.onLessonComplete) {
          const activeLesson = courseService.findLessonBySlug(course.data, store.activeLessonSlug);
          await store.config.onLessonComplete({
            lessonNumber: activeLesson?.$lessonNumber,
            isPrevLesson: !!prevLesson,
            isNextLesson: !!nextLesson,
            gas: res.gas,
          });
        }
        invalidateProgress();
      } else {
        const output = await editorService.run(
          plugin!,
          store.courseSlug!,
          store.activeLessonSlug,
          store.files,
        );
        editorActions.setOutput(output);
      }
    } finally {
      setRunning(false);
    }

    if (course.data.config.tests) {
      store.actions.setActivePanel(TEST_PANEL_ID);
    } else if (course.data.config.output) {
      store.actions.setActivePanel(OUTPUT_PANEL_ID);
    }
  };

  const handleGoToNext = () => {
    if (nextLesson && course.data) {
      const userAnalytics = new UserAnalytics();
      userAnalytics.sendGAEvent({
        category: EAnalyticsCategories.EDITOR,
        action: EAnalyticsActions.GO_TO_NEXT_LESSON,
      });
      router.push(courseService.getCoursePath(course.data, nextLesson.slug));
    }
  };

  const handleGoToPrev = () => {
    if (prevLesson && course.data) {
      const userAnalytics = new UserAnalytics();
      userAnalytics.sendGAEvent({
        category: EAnalyticsCategories.EDITOR,
        action: EAnalyticsActions.GO_TO_PREVIOUS_LESSON,
      });
      router.push(courseService.getCoursePath(course.data, prevLesson.slug));
    }
  };

  const getActionComponent = (action: string) => {
    const actions = plugin?.actions;
    if (!actions) {
      return;
    }
    const ActionComponent = actions[action];
    return <ActionComponent />;
  };

  console.debug(
    'nextLesson',
    nextLesson,
    'running',
    running,
    'status',
    progress[store.activeLessonSlug]?.status,
    'enableLessonsWithProgress',
    store.config.enableLessonsWithProgress,
  );

  const nextDisabled =
    !nextLesson ||
    running ||
    (progress[store.activeLessonSlug] &&
      progress[store.activeLessonSlug]?.status !== 'FINISHED' &&
      store.config.enableLessonsWithProgress);

  const runLabel = plugin?.labels?.runButton || 'RUN';

  return (
    <S.Wrapper>
      {actions.map(action => (
        <div key={action}>
          {action === 'run' ? (
            <AgButton
              onClick={handleRunCode}
              startIcon={
                running ? (
                  <CircularProgress color="secondary" size={14} />
                ) : (
                  <PlayArrowRoundedIcon />
                )
              }
            >
              {runLabel}
            </AgButton>
          ) : (
            getActionComponent(action)
          )}
        </div>
      ))}

      <IconButton aria-label="reset" onClick={handleResetCode}>
        <DeleteOutlineRoundedIcon />
      </IconButton>
      <IconButton aria-label="back" onClick={handleGoToPrev} disabled={!prevLesson || running}>
        <NavigateBeforeRoundedIcon />
      </IconButton>
      <AgButton
        onClick={handleGoToNext}
        color={nextLesson && !nextDisabled ? 'primary' : 'secondary'}
        disabled={nextDisabled}
        endIcon={!mobile && <NavigateNextRoundedIcon />}
      >
        {!mobile && 'NEXT'}
        {mobile && <NavigateNextRoundedIcon />}
      </AgButton>
    </S.Wrapper>
  );
};
