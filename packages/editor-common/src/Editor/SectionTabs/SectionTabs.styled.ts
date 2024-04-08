import styled from 'styled-components';
import { SECTION_TABS_WIDTH } from '../../constants';

export const Wrapper = styled.div`
  width: ${SECTION_TABS_WIDTH}px;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 1rem;
  border-right: 1px solid ${p => p.theme.custom.splitPaneLine};
`;

export const Logo = styled.div`
  width: 100%;
  height: 4rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: center;
  text-align: center;
  cursor: pointer;
`;

export const Tabs = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
`;

export const Settings = styled.div`
  display: flex;
  justify-items: center;
  margin-bottom: 0.5rem;
  flex-direction: column;
`;
