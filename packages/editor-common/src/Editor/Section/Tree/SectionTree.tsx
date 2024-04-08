import React from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

export const SectionTree = () => {
  return (
    <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      <TreeItem nodeId="1" label="Lesson 1">
        <TreeItem nodeId="2" label="Solution 1" />
      </TreeItem>
      <TreeItem nodeId="3" label="Lesson 2">
        <TreeItem nodeId="4" label="Solution 1" />
        <TreeItem nodeId="5" label="Solution 2" />
      </TreeItem>
    </TreeView>
  );
};
