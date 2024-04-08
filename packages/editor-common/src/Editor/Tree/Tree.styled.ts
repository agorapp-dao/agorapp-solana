import styled from 'styled-components';

import { alpha } from '@mui/material';

export const Directory = styled.div`
  font-family: monospace;
  font-size: 16px;
  user-select: none;
  padding: 20px;
  border-radius: 0.4em;

  .tree,
  .tree-node,
  .tree-node-group {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .tree-branch-wrapper,
  .tree-node__leaf {
    outline: none;
  }

  .tree-node {
    cursor: pointer;
  }

  .tree-node:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .tree .tree-node--focused {
    background: rgba(255, 255, 255, 0.2);
  }

  .tree .tree-node--selected {
    background: ${({ theme }) => alpha(theme.palette.primary.main, 0.3)};
  }

  .tree-node__branch {
    display: block;
  }

  .icon {
    vertical-align: middle;
    padding-right: 5px;
  }
`;
