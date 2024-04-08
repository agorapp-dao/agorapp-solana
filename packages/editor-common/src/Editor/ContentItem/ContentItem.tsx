import * as S from './ContentItem.styled';
import React, { useMemo, useState } from 'react';
import { TLesson } from '@agorapp-dao/content-common';
import { Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/router';
import { ContentLevel } from './ContentLevel';
import { courseService } from '../../services/courseService';
import { useEditorStore } from '../EditorStore';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LockIcon from '@mui/icons-material/Lock';
import { useTheme } from '@mui/material/styles';

interface TProps {
  item: TLesson;
  level: number;
  handleSelectLesson: (slug: string) => void;
  enableLessonsWithProgress?: boolean;
}

export const ContentItem: React.FC<TProps> = ({
  item,
  level,
  handleSelectLesson,
  enableLessonsWithProgress,
}: TProps) => {
  const theme = useTheme();
  const course = courseService.useCourse();
  const [opened, setOpened] = useState(true);
  const router = useRouter();
  const store = useEditorStore();
  const { progress } = courseService.useCourseProgress();

  // TODO: hotfix
  if (course.data?.slug == 'motoko-tutorial') {
    enableLessonsWithProgress = false;
  }
  const status = progress[item.slug!]?.status;
  const linkEnabled =
    !enableLessonsWithProgress ||
    (enableLessonsWithProgress && (status === 'FINISHED' || status === 'STARTED'));

  const handleClick = (lesson: TLesson) => {
    if (lesson.content && linkEnabled) {
      router.push(courseService.getCoursePath(course.data!, lesson.slug));
      handleSelectLesson(lesson.slug!);
    } else if (lesson.children?.length) {
      setOpened(!opened);
    }
  };

  const linkStyle = useMemo(() => {
    if (enableLessonsWithProgress) {
      const clickEnabled = status === 'FINISHED' || status === 'STARTED';
      return {
        cursor: clickEnabled ? 'pointer' : 'default',
        color: clickEnabled ? theme.custom.textPrimary : 'inherit',
        fontWeight: clickEnabled ? 900 : 'inherit',
      };
    }
    return {
      color: store.activeLessonSlug === item.slug ? theme.palette.primary.main : 'inherit',
    };
  }, [status, enableLessonsWithProgress, theme, store.activeLessonSlug, item.slug]);

  return (
    <>
      <S.ActiveLink onClick={() => handleClick(item)} disabled={!linkEnabled} style={linkStyle}>
        <S.Row>
          <S.Status>
            <div>
              {status === 'FINISHED' && <TaskAltIcon />}
              {status === 'STARTED' && <PlayArrowIcon />}
              {!status && enableLessonsWithProgress && <LockIcon />}
            </div>
          </S.Status>
          <S.Number level={level}>{item.$lessonNumber}</S.Number>
          <S.Name level={level}>{item.name}</S.Name>
          {item.children?.length && (
            <ExpandMoreIcon
              style={{
                transition: 'all 0.3s ease',
                transform: `rotate(${opened ? 0 : '0.5turn'})`,
              }}
            />
          )}
        </S.Row>
      </S.ActiveLink>
      {item.children?.length && (
        <Collapse in={opened} timeout={300}>
          <div style={{ marginTop: '1rem' }}>
            <ContentLevel
              lessons={item.children}
              level={level + 1}
              handleSelectLesson={handleSelectLesson}
              enableLessonsWithProgress={enableLessonsWithProgress}
            />
          </div>
        </Collapse>
      )}
    </>
  );
};

interface TProps {
  item: TLesson;
  level: number;
  handleSelectLesson: (slug: string) => void;
  enableLessonsWithProgress?: boolean;
}
