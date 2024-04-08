import { Button as MuiButton } from '@mui/material';
import styled from 'styled-components';

export const Button = styled(MuiButton).attrs(props => ({
  className: props.className,
}))`
  &.icon {
    width: 2.4rem;
    height: 2.4rem;
    padding: 0.65rem;
    border-radius: 50%;
    min-width: auto;

    img {
      width: auto;
      height: 100%;
    }
  }

  &.disabled {
    img {
      opacity: 0.3;
    }
  }
`;
