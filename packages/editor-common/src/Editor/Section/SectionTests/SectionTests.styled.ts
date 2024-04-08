import { styled } from '@mui/material/styles';

export const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;

  .test-passed {
    .test-icon,
    .test-title {
      color: ${props => props.theme.palette.success.main};
    }
  }

  .test-failed {
    .test-icon,
    .test-title {
      color: ${props => props.theme.palette.error.main};
    }
  }
`;
