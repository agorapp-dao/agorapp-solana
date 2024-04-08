import React from 'react';
import {
  Box,
  Button,
  ButtonProps,
  DialogProps,
  DialogTitle,
  Dialog,
  DialogActions,
  Typography,
  DialogContent,
  IconButton,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styled from 'styled-components';

interface Props extends Omit<DialogProps, 'title'> {
  title?: string | React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
  disableConfirm?: boolean;
  form?: string;
  header?: React.ReactNode;
  isFetching?: boolean;
  onCancel?: (data?: any) => void;
  onClose?: () => void;
  onConfirm?: (event?: any) => void;
  showConfirm?: boolean;
  showClose?: boolean;
  size: 'small' | 'medium' | 'large';
  subtitle?: React.ReactNode;
  variant?: 'constructive' | 'destructive';
}

const sizeMap: { [key: string]: string } = {
  small: 'xs',
  medium: 'sm',
  large: 'md',
};

const StyledPaper = styled(Paper)`
  background-color: ${p => p.theme.custom.background};
  background-image: none;
`;

const GeneralDialog: React.FC<Props> = ({
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  children = null,
  disableConfirm = false,
  form,
  header,
  subtitle,
  isFetching,
  onClose = null,
  onCancel = onClose || (() => {}),
  onConfirm,
  showConfirm = true,
  showClose = true,
  size,
  title,
  variant = 'constructive',
  actions = (showClose || showConfirm) && (
    <>
      {showClose && (
        <Button disabled={isFetching} onClick={onCancel} variant="outlined">
          {cancelLabel}
        </Button>
      )}
      {showConfirm &&
        (() => {
          const props: ButtonProps = {
            disabled: isFetching || disableConfirm,
            form: form,
            onClick: onConfirm,
            type: form ? 'submit' : 'button',
            variant: 'contained',
          };

          return variant === 'destructive' ? (
            <div>{confirmLabel}</div>
          ) : (
            <Button color="primary" {...props}>
              {confirmLabel}
            </Button>
          );
        })()}
    </>
  ),
  ...rest
}) => {
  const isSmall = size === 'small';

  return (
    <Dialog
      fullWidth
      PaperComponent={StyledPaper}
      maxWidth={sizeMap[size] as DialogProps['maxWidth']}
      transitionDuration={{ enter: 225, exit: 0 }}
      {...rest}
    >
      <DialogTitle style={{ padding: '5px', paddingLeft: '24px' }}>
        <Box
          alignItems="center"
          display="flex"
          fontSize="h4.fontSize"
          fontWeight="h4.fontWeight"
          justifyContent={size === 'small' ? 'center' : 'space-between'}
          style={{ width: '100%', paddingTop: '0.5rem', paddingRight: '0.5rem' }}
        >
          <>
            <Box flexGrow={1}>{title}</Box>
            {onClose && (
              <IconButton aria-label="Close modal" disabled={isFetching} onClick={onClose}>
                <CloseIcon />
              </IconButton>
            )}
          </>
        </Box>
        {subtitle && (
          <Box marginTop={isSmall ? 3 : 0}>
            <Typography
              className="three-line-text-overflow"
              variant={isSmall ? 'body1' : 'caption'}
            >
              {subtitle}
            </Typography>
          </Box>
        )}
      </DialogTitle>
      {header}
      {children && (
        <Box overflow={isSmall ? 'unset' : ''}>
          <DialogContent style={{ height: 'inherit', position: 'relative' }}>
            {children}
          </DialogContent>
        </Box>
      )}
      {actions && (
        <Box justifyContent={isSmall ? 'center' : ''}>
          <DialogActions>{actions}</DialogActions>
        </Box>
      )}
    </Dialog>
  );
};

export default GeneralDialog;
