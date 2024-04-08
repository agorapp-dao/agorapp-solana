import { Box, Grid } from '@mui/material';
import { SECTION_TABS_WIDTH } from '../../constants';
import { useEditorStore } from '../EditorStore';
import { useMobile } from '../../hooks/useMobile';

type TProps = {
  lessonHeader: React.ReactNode;
  content: React.ReactNode;
  offsetLeft?: number;
};

export const OverlayWithLessonHeader: React.FC<TProps> = ({
  lessonHeader,
  content,
  offsetLeft,
}) => {
  const store = useEditorStore();
  const { mobile } = useMobile();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'absolute',
        background: theme => theme.palette.background.default,
        left: `${SECTION_TABS_WIDTH}px`,
        right: '0',
        zIndex: 100,
        bottom: '0',
        top: `${store.config?.topOffset}px`,
      }}
    >
      <Grid
        container
        direction="column"
        sx={{
          width: mobile ? `100%` : `${offsetLeft}px`,
          flexWrap: 'nowrap',
          overflow: 'hidden',
        }}
      >
        <Grid item>{lessonHeader}</Grid>
        <Grid item sx={{ overflowY: 'auto' }}>
          {content}
        </Grid>
      </Grid>
    </Box>
  );
};
