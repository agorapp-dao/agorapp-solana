import React, { useState } from 'react';
import useClipboard from 'react-use-clipboard';
import { IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import * as S from './CopyToClibboard.styled';

type TProps = {
  text: any;
  children?: React.ReactNode;
};

export const CopyToClipboard = ({ text, children }: TProps) => {
  const [isCopied, setCopied] = useClipboard(text, {
    successDuration: 1000,
  });

  const [showCopy, setShowCopy] = useState(false);

  const copyButton = (
    <IconButton aria-label="copy-to-clipboard" onClick={setCopied}>
      <Tooltip title={isCopied ? 'Copied' : 'Copy'}>
        {isCopied ? (
          <CheckIcon color="primary" fontSize="small" />
        ) : (
          <ContentCopyIcon fontSize="small" />
        )}
      </Tooltip>
    </IconButton>
  );

  return (
    <>
      {children && (
        <div
          onMouseEnter={() => setShowCopy(true)}
          onMouseLeave={() => setShowCopy(false)}
          style={{ position: 'relative' }}
        >
          <S.Icon className={showCopy ? 'visible' : undefined}>{copyButton}</S.Icon>
          {children}
        </div>
      )}

      {!children && copyButton}
    </>
  );
};
