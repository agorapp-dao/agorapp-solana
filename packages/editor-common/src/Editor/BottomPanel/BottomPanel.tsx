import { useEffect, useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import * as S from './BottomPanel.styled';
import { useEditorStore } from '../EditorStore';
import { SectionOutput } from '../Section/SectionOutput/SectionOutput';
import { courseService } from '../../services/courseService';
import { SectionTests } from '../Section/SectionTests/SectionTests';
import { useEditorPlugin } from '../Monaco/useEditorPlugin';
import { TEditorPanel } from '../../types/TEditorPanel';

export const TEST_PANEL_ID = 'test';
export const OUTPUT_PANEL_ID = 'output';

export const BottomPanel = () => {
  const [panels, setPanels] = useState<TEditorPanel<unknown>[]>([]);
  const store = useEditorStore();
  const course = courseService.useCourse();
  const plugin = useEditorPlugin();

  useEffect(() => {
    if (!course.data || !plugin) {
      return;
    }

    const newPanels: TEditorPanel<unknown>[] = [];
    if (course.data.config.output) {
      newPanels.push({
        id: OUTPUT_PANEL_ID,
        label: 'Output',
        component: SectionOutput,
        props: {},
      });
    }
    if (course.data.config.tests) {
      newPanels.push({
        id: TEST_PANEL_ID,
        label: 'Tests',
        component: SectionTests,
        props: {},
      });
    }
    for (const panel of store.panels) {
      newPanels.push(panel);
    }
    setPanels(newPanels);

    if (!store.activePanel && newPanels.length > 0) {
      store.actions.setActivePanel(newPanels[0].id);
    }
  }, [course.data, plugin, store]);

  const changeActiveTab = (event: React.SyntheticEvent, panelId: string) => {
    store.actions.setActivePanel(panelId);
  };

  const activePanel = panels.find(p => p.id === store.activePanel) ?? panels[0];

  return (
    <Box
      sx={{
        width: '100%',
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: theme => theme.custom.splitPaneLine }}>
        <Tabs value={store.activePanel} onChange={changeActiveTab}>
          {panels.map(panel => (
            <Tab label={panel.label} key={panel.id} value={panel.id} />
          ))}
        </Tabs>
      </Box>
      <S.Content>
        {activePanel && <activePanel.component {...(activePanel.props as {})} />}
      </S.Content>
    </Box>
  );
};
