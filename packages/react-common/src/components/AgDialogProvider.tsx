import React, { useState, FC, useContext, createContext, useMemo } from 'react';
import AgDialog, { TAgDialogProps } from './AgDialog';

interface PromiseInfo {
  resolve: (value: boolean | PromiseLike<boolean>) => void;
  reject: (reason?: any) => void;
}

interface DialogContext {
  show: (options: TAgDialogProps) => Promise<boolean>;
  close: () => void;
}

const DialogContext = createContext<DialogContext>({} as DialogContext);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!Object.keys(context).length) {
    throw new Error('Component is not wrapped with a DialogProvider.');
  }
  return context;
};

const DialogProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<TAgDialogProps>({
    size: 'small',
    open: false,
  });
  const [promiseInfo, setPromiseInfo] = useState<PromiseInfo>();

  const actions = useMemo(() => {
    return {
      show: (options: TAgDialogProps) => {
        return new Promise<boolean>((resolve, reject) => {
          setPromiseInfo({ resolve, reject });
          setOptions(options);
          setOpen(true);
        });
      },
      close: () => {
        setOpen(false);
        promiseInfo?.resolve(false);
        setPromiseInfo(undefined);
      },
    };
  }, [setOpen, setOptions, setPromiseInfo, promiseInfo]);

  const handleConfirm = () => {
    setOpen(false);
    promiseInfo?.resolve(true);
    setPromiseInfo(undefined);
  };

  const handleCancel = () => {
    setOpen(false);
    promiseInfo?.resolve(false);
    setPromiseInfo(undefined);
  };

  return (
    <>
      <AgDialog {...options} open={open} onClose={handleCancel} onConfirm={handleConfirm} />
      <DialogContext.Provider value={actions}>{children}</DialogContext.Provider>
    </>
  );
};
export default DialogProvider;
