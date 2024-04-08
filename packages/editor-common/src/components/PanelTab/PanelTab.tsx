import React from 'react';
import { styled } from '@mui/material/styles';
import { Tab } from '@mui/material';

// TODO - solve 'any'
export const PanelTab = styled((props: any) => <Tab {...props} />)(({ theme }) => ({
  textTransform: 'none',
}));
