import { useEffect, useState } from 'react';
import * as S from './Solution.styled';
import { Markdown } from '../Markdown/Markdown';
import { useEditorActions, useEditorStore } from '../EditorStore';
import { AgButton } from '@agorapp-dao/react-common';
import CodeIcon from '@mui/icons-material/Code';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { EEditorSectionType } from '../../constants';
import { useMobile } from '../../hooks/useMobile';

export interface SolutionProps {
  content: string;
}

export const Solution = ({ content }: SolutionProps) => {
  const [shown, setShown] = useState(false);
  const editorStore = useEditorStore();
  const actions = useEditorActions();
  const { mobile } = useMobile();

  useEffect(() => {
    // reset solution state when lesson changes
    setShown(false);
  }, [editorStore.activeLessonSlug]);

  return (
    <S.Wrapper>
      {mobile && (
        <AgButton
          startIcon={<CodeIcon />}
          color="secondary"
          onClick={() => actions.setCurrentSection(EEditorSectionType.CODE)}
        >
          Go to code
        </AgButton>
      )}
      <S.H2>Solution</S.H2>
      {!shown ? (
        <AgButton startIcon={<HelpOutlineIcon />} color="secondary" onClick={() => setShown(true)}>
          Show solution
        </AgButton>
      ) : (
        <>
          <Markdown>{content}</Markdown>
        </>
      )}
    </S.Wrapper>
  );
};
