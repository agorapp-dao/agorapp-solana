import { AgButton, useDialog } from '@agorapp-dao/react-common';
import { Grid, Typography } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { EColorMode } from '@agorapp-dao/react-common/src/types/misc';
import { AGORAPP_WEB } from '../../constants/config';

export const useAuthorDialog = () => {
  const { show } = useDialog();
  const showAuthorDialog = () => {
    return show({
      title: 'The Native IDE for Web3 Development',
      children: <AuthorDialogContent />,
      showConfirm: false,
      showClose: false,
      size: 'small',
      open: true,
    });
  };
  return { showAuthorDialog };
};

const AuthorDialogContent = () => {
  const theme = useTheme();
  return (
    <>
      <Grid container justifyContent="center">
        <Grid item sx={{ width: '200px' }}>
          <img
            src={
              theme.palette.mode === EColorMode.dark
                ? '/images/AgorAppLogoDark.svg'
                : '/images/AgorAppLogoLight.svg'
            }
            alt="AgorApp"
          />
        </Grid>
      </Grid>
      <br />
      <Typography variant="body1" align="center">
        Check out courses & challenges to improve your programming knowledge
      </Typography>
      <br />
      <Grid container justifyContent="center">
        <Grid item>
          <AgButton
            onClick={() => {
              window.open(AGORAPP_WEB, '_blank');
            }}
          >
            Go to AgorApp
          </AgButton>
        </Grid>
      </Grid>
    </>
  );
};
