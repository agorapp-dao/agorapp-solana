import styled, { createGlobalStyle } from 'styled-components';
import { alpha } from '@mui/system';

export const GlobalStyle = createGlobalStyle`
  html, body {
    max-width: 100vw;
    height: 100%;
    color: ${({ theme }) => theme.custom.textSecondary};
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button, input {
    border: 0;
    background: transparent;
    color: ${({ theme }) => theme.custom.textPrimary};
  }
  
  .sash-wrap-line {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    .line {
      display: block;
      height: 100%;
      width: 1px;
      background-color: ${({ theme }) => theme.custom.splitPaneLine};
    }
    &.active {
      background-color: ${({ theme }) => theme.palette.primary.main} !important;
    }
    &.inactive {
      transition: none;
    }
  }
  
  .fullscreen {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
  }

  #__next {
    height: 100%;
  }

  /** Global definition of scrollbars */
  &::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }

  ::-webkit-scrollbar-corner {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${p => alpha(p.theme.palette.secondary.light, 0.5)};
    border-radius: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-left: 2px solid transparent;
    border-right: 2px solid transparent;
    background-clip: padding-box;
  }

  *::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.palette.secondary.light};
    border-radius: 5px;
    background-clip: content-box;
  }

  *::-webkit-scrollbar-track {
    border-left: 2px solid transparent;
    border-right: 2px solid transparent;
  }
`;

export const Main = styled.main`
  background: ${p => p.theme.background};
  height: 100%;
  display: flex;
  flex-direction: row;
`;
