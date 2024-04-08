import React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { AgorAppLogo } from '../../constants/assets';
import { AGORAPP_WEB } from '../../constants/config';
import GeneralDialog from '../General/Dialog/GeneralDialog';

type TProps = {
  open: boolean;
  handleClose: () => void;
};

export const AuthorDialog: React.FC<TProps> = ({ open, handleClose }: TProps) => {
  return (
    <GeneralDialog
      size="medium"
      open={open}
      showConfirm={false}
      showClose={false}
      onClose={handleClose}
    >
      <Grid container direction="column" alignItems="center" justifyContent="center" spacing={4}>
        <Grid item>
          <img src={AgorAppLogo} alt="AgorApp" />
        </Grid>
        <Grid item>
          <Typography variant="h2" align="center">
            The Native IDE for Web3 Development
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="subtitle1" align="center">
            Check out courses & challenges to improve your programming knowledge
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            sx={{ borderRadius: '1.6rem' }}
            href={AGORAPP_WEB}
            target="_blank"
          >
            Go to AgorApp
          </Button>
        </Grid>
        <Grid item></Grid>
      </Grid>
    </GeneralDialog>
  );
};
