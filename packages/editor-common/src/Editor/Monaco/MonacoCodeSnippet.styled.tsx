import styled from 'styled-components';

// TODO define color globally
export const Block = styled.div`
  display: block;
  position: relative;
  background: ${p => p.theme.custom.cardBg};
  border-radius: 5px;
  margin: 1rem 0;
  padding: 1rem;
  overflow-y: scroll;
  font-size: 0.9em;
`;

export const Inline = styled.code`
  position: relative;
  background: ${p => p.theme.custom.cardBg};
  border-radius: 5px;
  padding: 0.1rem 0.3rem;
  display: inline-block;
  font-size: 0.9em;
`;

export const CopyToClipBoard = styled.span`
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
`;
