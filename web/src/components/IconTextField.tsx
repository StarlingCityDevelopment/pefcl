import { InputAdornment, type StandardTextFieldProps, TextField } from '@mui/material';
import type React from 'react';

interface IconTextFieldProps extends StandardTextFieldProps {
  icon: React.ReactElement;
}

const IconTextField: React.FC<IconTextFieldProps> = ({ icon, ...props }) => (
  <>
    <TextField {...props} InputProps={{ startAdornment: <InputAdornment position='start'>{icon}</InputAdornment> }} />
  </>
);

export default IconTextField;
