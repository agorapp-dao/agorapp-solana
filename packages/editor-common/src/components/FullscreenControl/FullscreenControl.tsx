import { useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { EAnalyticsActions, EAnalyticsCategories, UserAnalytics } from '@agorapp-dao/react-common';

export const FullscreenControl = () => {
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const userAnalytics = new UserAnalytics();
    userAnalytics.sendGAEvent({
      category: EAnalyticsCategories.EDITOR,
      action: fullscreen
        ? EAnalyticsActions.TURN_FULL_SCREEN_OFF
        : EAnalyticsActions.TURN_FULL_SCREEN_ON,
    });
    const newState = !fullscreen;
    setFullscreen(newState);
    if (newState) {
      document.body.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const fullscreenchange = () => {
      if (!document.fullscreenElement) {
        setFullscreen(false);
        const userAnalytics = new UserAnalytics();
        userAnalytics.sendGAEvent({
          category: EAnalyticsCategories.EDITOR,
          action: EAnalyticsActions.TURN_FULL_SCREEN_OFF,
        });
      }
    };
    document.addEventListener('fullscreenchange', fullscreenchange);
    return () => {
      document.removeEventListener('fullscreenchange', fullscreenchange);
    };
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderBottom: 1,
        borderColor: theme => theme.custom.splitPaneLine,
      }}
    >
      <IconButton aria-label="fullscreen" onClick={toggleFullscreen}>
        {!fullscreen && <FullscreenIcon />}
        {fullscreen && <FullscreenExitIcon />}
      </IconButton>
    </Box>
  );
};
