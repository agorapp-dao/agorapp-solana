import { Box, IconButton, alpha, Tab, Tabs, Icon } from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';
import * as S from './SectionTabs.styled';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import CodeIcon from '@mui/icons-material/Code';
import { EEditorSectionType } from '../../constants';
import { useMobile } from '../../hooks/useMobile';
import { useEditorActions, useEditorStore } from '../EditorStore';
import { FeedbackBtn } from '../../components/Feeback/FeedbackBtn';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useSettingsDialog } from '../../hooks/dialog/useSettingsDialog';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { courseService } from '../../services/courseService';
import { useAuthorDialog } from '../../hooks/dialog/useAuthorDialog';
import AdbIcon from '@mui/icons-material/Adb';

interface StyledTabProps {
  icon?: string | React.ReactElement;
  value: EEditorSectionType;
}

const AntTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  [theme.breakpoints.up('sm')]: {
    minWidth: 0,
  },
  fontWeight: theme.typography.fontWeightRegular,
  '&:hover': {
    color: theme.palette.primary.main,
    opacity: 1,
  },
  '&.Mui-selected': {
    background: alpha(theme.palette.primary.light, 0.3),
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

export const SectionTabs = () => {
  const { mobile } = useMobile();
  const { showSettingsDialog } = useSettingsDialog();
  const { showAuthorDialog } = useAuthorDialog();
  const store = useEditorStore();
  const actions = useEditorActions();
  const { data: course } = courseService.useCourse();

  const changeSection = (event: React.SyntheticEvent, section: EEditorSectionType) => {
    actions.setCurrentSection(section);
  };

  const lessonCount = course?.lessons.length || 0;

  return (
    <S.Wrapper>
      {!store.config.hideAuthor && (
        <S.Logo onClick={() => showAuthorDialog()}>
          <Icon sx={{ fontSize: 40 }} style={{ width: '100%', lineHeight: 0 }}>
            <img
              src={'/images/AgorAppIcon.svg'}
              height={35}
              width={35}
              alt="AgorApp"
              style={{ marginLeft: '2px' }}
            />
          </Icon>
        </S.Logo>
      )}
      <S.Tabs>
        <Box sx={{ flexGrow: 1, display: 'flex', height: 224 }}>
          <Tabs
            orientation="vertical"
            value={
              !mobile && store.currentSection === EEditorSectionType.CODE
                ? EEditorSectionType.LESSON
                : store.currentSection
            }
            onChange={changeSection}
            aria-label="Navigation menu"
            sx={{ borderRight: 0 }}
          >
            {lessonCount > 1 && (
              <AntTab
                icon={<FormatListBulletedIcon />}
                value={EEditorSectionType.TABLE_OF_CONTENTS}
              />
            )}
            <AntTab icon={<MenuBookIcon />} value={EEditorSectionType.LESSON} />
            {store.tabs.length > 1 && (
              <AntTab icon={<FolderOpenIcon />} value={EEditorSectionType.TREE} />
            )}
            {mobile && <AntTab icon={<CodeIcon />} value={EEditorSectionType.CODE} />}
            {mobile && <AntTab icon={<AdbIcon />} value={EEditorSectionType.LOG} />}
          </Tabs>
        </Box>
      </S.Tabs>
      {store.courseSlug && store.activeLessonSlug && (
        <FeedbackBtn
          userCode={store.tabs[store.activeTab]?.model.getValue()}
          slug={`${store.courseSlug}/${store.activeLessonSlug}`}
        />
      )}
      <S.Settings>
        <Box sx={{ textAlign: 'center' }}>
          <IconButton aria-label="settings" onClick={() => showSettingsDialog()}>
            <SettingsRoundedIcon />
          </IconButton>
        </Box>
      </S.Settings>
    </S.Wrapper>
  );
};
