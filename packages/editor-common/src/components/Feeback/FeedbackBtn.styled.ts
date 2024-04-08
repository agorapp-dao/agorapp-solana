import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 150px;
`;

export const Rotate = styled.div`
  position: relative;
  transform: rotate(-90deg);
  top: 0;
  right: 0;
`;

export const InnerWrapper = styled.div`
  opacity: 0.7;
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: -20px;
  padding: 4px 6px;
`;
