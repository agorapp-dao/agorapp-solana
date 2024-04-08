import React, { useState } from 'react';
import { Box } from '@mui/material';
import { courseService } from '../../../services/courseService';
import { Markdown } from '../../Markdown/Markdown';
import { Solution } from '../../Solution/Solution';
import { useEditorStore } from '../../EditorStore';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`lesson-tabpanel-${index}`} {...other}>
      {value === index && <div style={{ padding: '1rem 0' }}>{children}</div>}
    </div>
  );
}

export const SectionLesson = () => {
  const [lessonTab, setLessonTab] = useState(0);
  const store = useEditorStore();
  const course = courseService.useCourse();
  const activeLesson = courseService.findLessonBySlug(course.data, store.activeLessonSlug);
  const markdown = courseService.useContent(course.data, activeLesson?.content);
  const solutionMarkdown = courseService.useContent(course.data, activeLesson?.solution);

  const changeTab = (event: React.SyntheticEvent, newValue: number) => {
    setLessonTab(newValue);
  };

  return (
    <div style={{ margin: '1.5rem' }}>
      <Box sx={{ width: '100%', flex: '1 1 auto' }}>
        {/*TODO: multiple content tab support coming later*/}
        {/*{activeLesson?.content && activeLesson?.content.length > 1 && (*/}
        {/*  <>*/}
        {/*    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>*/}
        {/*      <Tabs value={lessonTab} onChange={changeTab} centered>*/}
        {/*        {activeLesson.content.map(item => (*/}
        {/*          <Tab key={item.tab} label={item.tab} />*/}
        {/*        ))}*/}
        {/*      </Tabs>*/}
        {/*    </Box>*/}
        {/*    {activeLesson.content.map((item, index) => (*/}
        {/*      <TabPanel value={lessonTab} index={index} key={index}>*/}
        {/*        <Markdown>{markdown.data || ''}</Markdown>*/}
        {/*      </TabPanel>*/}
        {/*    ))}*/}
        {/*  </>*/}
        {/*)}*/}
        {activeLesson?.content && <Markdown>{markdown.data || ''}</Markdown>}
        {solutionMarkdown.data && <Solution content={solutionMarkdown.data} />}
      </Box>
    </div>
  );
};
