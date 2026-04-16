import { useGlobalSettings } from '@hooks/useGlobalSettings';
import { Dialog, DialogProps } from '@mui/material';
import React, { ReactNode } from 'react';

interface BaseDialogProps extends DialogProps {
  children: ReactNode;
}
const BaseDialog = (props: BaseDialogProps) => {
  const { isMobile } = useGlobalSettings();

  return (
    <Dialog
      {...props}
      fullWidth
      disablePortal={isMobile}
      fullScreen={false}
      sx={{
        position: isMobile ? 'absolute' : 'fixed',
        height: '100%',
        '& .MuiDialog-container': isMobile
          ? {
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }
          : {},
        '& .MuiDialog-paper': isMobile
          ? {
              margin: 0,
              width: '100%',
              borderRadius: '24px',
              backgroundImage: 'none',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }
          : {},
      }}
    >
      {props.children}
    </Dialog>
  );
};

export default BaseDialog;
