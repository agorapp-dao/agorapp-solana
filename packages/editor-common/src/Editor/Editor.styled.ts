import { Box } from '@mui/material';
import styled, { css } from 'styled-components';
import { SECTION_TABS_WIDTH } from '../constants';
import rgba from 'polished/lib/color/rgba';

export const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  .monaco-scrollable-element > .scrollbar > .slider {
    background: ${p => rgba(p.theme.custom.scrollbar, 0.7)} !important;
    border-radius: 5px;
  }
  .monaco-editor .view-overlays .current-line {
    border: 0 !important;
    background: ${p => rgba(p.theme.custom.secondary, 0.5)} !important;
  }
  .decorationsOverviewRuler {
    display: none !important;
  }

  .monaco-editor .view-overlays .current-line {
    background: ${p => p.theme.custom.cardBg} !important;
  }
`;

export const OverlayBox = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: #22212c;
  z-index: 1;
  padding: 1.5rem;
`;

export const SectionContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
`;

export const Section = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding-right: 4px;
`;

interface IOverlaySectionProps {
  $top?: number;
}

export const OverlaySection = styled.div<IOverlaySectionProps>`
  position: absolute;
  top: 168px;
  left: ${SECTION_TABS_WIDTH}px;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  background-color: ${p => p.theme.custom.background};
  ${({ $top }) =>
    $top &&
    css`
      top: ${$top}px;
    `}
`;

export const RightPane = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const Code = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

export const BottomPanel = styled.div`
  position: relative;
`;

export const ListOfContents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
`;
