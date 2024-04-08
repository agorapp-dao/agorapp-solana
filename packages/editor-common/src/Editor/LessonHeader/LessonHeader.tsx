import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';
import React from 'react';
import rgba from 'polished/lib/color/rgba';
import CloseIcon from '@mui/icons-material/Close';
import { useEditorStore } from '../EditorStore';

type TProps = {
  courseTitle: string;
  lessonTitle: string;
  lessonNumber?: string;
  opened: boolean;
  handleClick: () => void;
  handleResize?: (w: number, h: number) => void;
};

export const LessonHeader: React.FC<TProps> = ({
  handleClick,
  courseTitle,
  lessonTitle,
  lessonNumber,
  opened,
}) => {
  const store = useEditorStore();
  return (
    <Box
      sx={{
        borderBottom: theme => `1px solid ${theme.custom.splitPaneLine}`,
      }}
    >
      <Box sx={{ p: { xs: '0.5rem', sm: '0.5rem 1rem' } }}>{store.headerContent}</Box>
      <Box
        onClick={handleClick}
        sx={{
          display: 'flex',
          m: { xs: '0.5rem', sm: '1rem' },
          p: { xs: '0.5rem', sm: '0.5rem 1rem' },
          gap: 2,
          color: theme => theme.palette.text.primary,
          cursor: 'pointer',
          borderRadius: '10px',
          transition: 'background-color 0.5s ease',
          '&:hover': {
            backgroundColor: theme => rgba(theme.palette.secondary.light, 0.3),
          },
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <h1 style={{ margin: 0, lineHeight: '1.5rem', marginBottom: '0.5rem' }}>
            <Box sx={{ fontSize: { xs: '1.2rem', sm: '1.4rem' } }}>{courseTitle}</Box>
          </h1>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
            }}
            alignItems="center"
          >
            <Box>
              <h2
                style={{
                  fontSize: '20px',
                  margin: 0,
                  lineHeight: '1.4rem',
                }}
              >
                <Box
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.2rem' },
                    color: theme => theme.palette.primary.main,
                  }}
                >
                  {lessonNumber && <span style={{ fontWeight: 'normal' }}>{lessonNumber}</span>}{' '}
                  {lessonTitle}
                </Box>
              </h2>
            </Box>
          </Box>
        </Box>
        <Box>{opened ? <CloseIcon /> : <ExpandMoreIcon />}</Box>
      </Box>
    </Box>
  );
};
