import {
  Box,
  ButtonProps,
  DialogProps,
  DialogTitle,
  Dialog,
  DialogActions,
  Typography,
  DialogContent,
  IconButton,
  PaperProps,
  Paper,
  alpha,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styled from 'styled-components';
import { AgButton } from './AgButton';

export interface TAgDialogProps extends Omit<DialogProps, 'title'> {
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
  hideIconClose?: boolean;
  size: 'small' | 'medium' | 'large' | number;
  subtitle?: React.ReactNode;
  variant?: 'constructive' | 'destructive';
  styledPaper?: React.JSXElementConstructor<PaperProps>;
}

const sizeMap: { [key: string]: string } = {
  small: 'xs',
  medium: 'sm',
  large: 'md',
};

const DefaultStyledPaper = styled(Paper)`
  background-image: none;
  overflow-y: unset;
  max-height: 80vh;
`;

const AgDialog: React.FC<TAgDialogProps> = ({
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  children = null,
  disableConfirm = false,
  form,
  header,
  subtitle,
  isFetching,
  onClose = undefined,
  onCancel = onClose || (() => {}),
  onConfirm,
  showConfirm = true,
  showClose = true,
  hideIconClose = false,
  size,
  title,
  variant = 'constructive',
  styledPaper,
  actions = (showClose || showConfirm || !hideIconClose) && (
    <>
      {!hideIconClose && (
        <Box
          sx={{
            position: 'absolute',
            right: '-20px',
            top: '-20px',
            backgroundColor: theme => theme.custom.dialogBg,
            border: theme => `1px solid ${theme.palette.background.default}`,
            borderRadius: '50%',
          }}
        >
          <IconButton aria-label="Close dialog" disabled={isFetching} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      {showClose && (
        <AgButton disabled={isFetching} onClick={onCancel} color="secondary">
          {cancelLabel}
        </AgButton>
      )}
      {showConfirm &&
        (() => {
          const props: ButtonProps = {
            disabled: isFetching || disableConfirm,
            form,
            onClick: onConfirm,
            type: form ? 'submit' : 'button',
            variant: 'contained',
          };

          return variant === 'destructive' ? (
            <div>{confirmLabel}</div>
          ) : (
            <AgButton {...props} color="primary">
              {confirmLabel}
            </AgButton>
          );
        })()}
    </>
  ),
  ...rest
}) => {
  const isSmall = size === 'small';
  const dialogStyle = styledPaper || DefaultStyledPaper;
  return (
    <Dialog
      fullWidth
      PaperComponent={dialogStyle}
      maxWidth={sizeMap[size] as DialogProps['maxWidth']}
      transitionDuration={{ enter: 225, exit: 0 }}
      sx={{
        '& .MuiPaper-root': {
          backgroundColor: theme => theme.custom.dialogBg,
        },
        '& .MuiModal-backdrop': {
          backgroundColor: theme => alpha(theme.palette.background.default, 0.7),
        },
      }}
      {...rest}
    >
      {(title || subtitle) && (
        <DialogTitle style={{ padding: '5px' }}>
          <div
            style={{
              width: '100%',
              paddingTop: '0.5rem',
              paddingRight: '0.5rem',
              fontSize: '2rem',
              lineHeight: 1.2,
              textAlign: 'center',
              padding: '20px 0px',
            }}
          >
            {title}
          </div>
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
      )}
      {header}
      {children && (
        <Box
          overflow={isSmall ? 'unset' : ''}
          style={{ display: 'flex', flex: 1, overflow: 'hidden' }}
        >
          <DialogContent
            style={{
              height: 'inherit',
              position: 'relative',
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
            }}
          >
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

AgDialog.defaultProps = {
  title: '',
};

export default AgDialog;
