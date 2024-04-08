import TreeView, { flattenTree } from 'react-accessible-treeview';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import * as S from './Tree.styled';
import { useEditorStore } from '../EditorStore';
import { useMemo } from 'react';
import { FileIcon, defaultStyles } from 'react-file-icon';
import { Unstable_Grid2 } from '@mui/material';

type TTreeMetadata = {
  tabIndex: number;
};

export const Tree = () => {
  const store = useEditorStore();
  const data = useMemo(() => {
    const folder = {
      name: '',
      children: store.tabs.map((tab, index) => {
        return { name: tab.path, metadata: { tabIndex: index } };
      }),
    };
    return flattenTree<TTreeMetadata>(folder);
  }, [store.tabs]);

  const index = useMemo(() => {
    return data.findIndex(tab => tab.metadata?.tabIndex === store.activeTab);
  }, [data, store.activeTab]);

  return (
    <S.Directory>
      <TreeView
        data={data}
        aria-label="directory tree"
        selectedIds={[index]}
        onNodeSelect={props => {
          if (props.element.metadata?.tabIndex !== undefined) {
            store.actions.setActiveTab(props.element.metadata.tabIndex as number);
          }
        }}
        nodeRenderer={({ element, isBranch, isExpanded, getNodeProps, level }) => (
          <Unstable_Grid2
            container
            {...getNodeProps()}
            style={{ paddingLeft: 20 * (level - 1) }}
            gap={1}
            alignItems="center"
          >
            <Unstable_Grid2 sx={{ p: 0.5 }}>
              {isBranch ? (
                <Folder isOpen={isExpanded} />
              ) : (
                <div style={{ width: '20px' }}>
                  <FileIcon
                    extension={element.name.slice(element.name.lastIndexOf('.') + 1)}
                    {...defaultStyles['ts']}
                  />
                </div>
              )}
            </Unstable_Grid2>
            <Unstable_Grid2>{element.name}</Unstable_Grid2>
          </Unstable_Grid2>
        )}
      />
    </S.Directory>
  );
};

type TFolderProps = {
  isOpen: boolean;
};

const Folder = ({ isOpen }: TFolderProps) => (isOpen ? <FolderOpenIcon /> : <FolderIcon />);
