import styled from 'styled-components';

export const Wrapper = styled.span`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const UnderlineText = styled.span`
  border-bottom: 1px solid ${p => p.theme.custom.border};
  margin: 1rem 0;
  width: 90%;
`;
