import { Grid, Typography } from '@mui/material';
import React from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import * as S from './SectionTests.styled';
import { useEditorStore } from '../../EditorStore';

export function SectionTests() {
  const store = useEditorStore();
  const testResults = store.testResults;

  if (!Object.entries(testResults || {}).length) {
    return (
      <Grid container>
        <Grid item sx={{ color: theme => theme.palette.secondary.light }}>
          Complete the exercise and Run the code.
        </Grid>
      </Grid>
    );
  }

  return (
    <S.Wrapper>
      <Grid container direction="column">
        <Grid item>
          <Typography
            variant="h6"
            mb={2}
            sx={{
              color: theme =>
                testResults?.passed ? theme.palette.success.main : theme.palette.error.main,
            }}
          >
            {testResults?.passed ? 'You passed the lesson!' : 'Wrong solution!'}
          </Typography>
        </Grid>
        {testResults?.error && (
          <Grid item>
            <Typography variant="body2">Error: {testResults.error}</Typography>
          </Grid>
        )}
        {!!testResults?.tests?.length && (
          <Grid container direction="column">
            {testResults.tests.map(t => (
              <Grid
                container
                columnSpacing={1.5}
                key={t.title}
                className={t.passed ? 'test-passed' : 'test-failed'}
              >
                <Grid item className="test-icon">
                  {t.passed ? <TaskAltIcon /> : <HighlightOffIcon />}
                </Grid>
                <Grid item xs container direction="column">
                  <Grid item className="test-title">
                    {t.title}
                  </Grid>
                  {t.error && (
                    <Grid item className="test-error">
                      <Typography variant="body2">Error: {t.error}</Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    </S.Wrapper>
  );
}
