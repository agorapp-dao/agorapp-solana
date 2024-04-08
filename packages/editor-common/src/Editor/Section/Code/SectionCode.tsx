import React from 'react';
import { Box, Tabs, useMediaQuery } from '@mui/material';
import { PanelTab } from '../../../components/PanelTab/PanelTab';
import { FullscreenControl } from '../../../components/FullscreenControl/FullscreenControl';
import { MonacoEditor } from '../../Monaco/MonacoEditor';
import { useEditorStore } from '../../EditorStore';
import { useTheme } from '@mui/material/styles';

export const SectionCode = () => {
  const store = useEditorStore();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const changeActiveTab = (event: React.SyntheticEvent, newValue: number) => {
    store.actions.setActiveTab(newValue);
  };

  if (!store.tabs.length) {
    return <div></div>;
  }

  return (
    <>
      <Box display="flex" flexDirection="row">
        <Box
          sx={{
            borderBottom: 1,
            borderColor: theme => theme.custom.splitPaneLine,
            flex: '1 1 auto',
          }}
        >
          <Tabs value={store.activeTab} onChange={changeActiveTab}>
            {store.tabs?.map((tab, index) => (
              <PanelTab label={tab.path} key={index} value={index} />
            ))}
          </Tabs>
        </Box>
        {!isMobile && <FullscreenControl />}
      </Box>
      <MonacoEditor model={store.tabs[store.activeTab]?.model} />
    </>
  );
};
