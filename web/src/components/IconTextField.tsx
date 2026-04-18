import type React from 'react';
import TextField from './ui/Fields/TextField';

interface IconTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactElement;
  label?: string;
  helperText?: string;
  error?: boolean;
}

const IconTextField: React.FC<IconTextFieldProps> = ({ icon, ...props }) => (
  <TextField {...props} startAdornment={icon} />
);

export default IconTextField;
