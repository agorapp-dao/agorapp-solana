import styled from 'styled-components';

export const Wrapper = styled.div`
  margin-top: 40px;
`;

export const H2 = styled.h2`
  width: 100%;
  display: block;
  padding-top: 1rem;
  font-size: 1.3rem;
  color: ${p => p.theme.palette.primary.main};
  border-bottom: 1px solid ${p => p.theme.custom.splitPaneLine};
`;
