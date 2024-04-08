import styled from 'styled-components';

export const Icon = styled.div`
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.3s linear;
  right: 0.5rem;
  top: 0.5rem;
  z-index: 10;
  position: absolute;

  &.visible {
    visibility: visible;
    opacity: 1;
  }
`;
