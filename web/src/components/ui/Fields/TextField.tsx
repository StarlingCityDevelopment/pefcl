import styled from '@emotion/styled';
import {
  InputBase,
  InputBaseProps,
  StandardTextFieldProps,
  Typography,
  alpha,
  Stack,
} from '@mui/material';
import React from 'react';
import theme from '../../../utils/theme';

const InputContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isError',
})<{ isError?: boolean }>`
  display: flex;
  min-height: 44px;
  align-items: center;
  padding: 0 0.875rem;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid
    ${(props) =>
      props.isError ? alpha(theme.palette.error.main, 0.5) : 'rgba(255, 255, 255, 0.06)'};
  transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);

  &:hover {
    background-color: rgba(255, 255, 255, 0.06);
    border-color: ${(props) =>
      props.isError ? theme.palette.error.main : 'rgba(255, 255, 255, 0.12)'};
  }

  &:focus-within {
    background-color: rgba(255, 255, 255, 0.02);
    border-color: ${(props) =>
      props.isError ? theme.palette.error.main : alpha(theme.palette.primary.main, 0.6)};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.isError
          ? alpha(theme.palette.error.main, 0.1)
          : alpha(theme.palette.primary.main, 0.08)};
  }

  & > div {
    flex: 1;
  }

  input {
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.005em;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-transition: background-color 5000s ease-in-out 0s;
    transition: background-color 5000s ease-in-out 0s;
    -webkit-text-fill-color: ${theme.palette.text.primary} !important;
  }
`;

const Label = styled(Typography)`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${theme.palette.text.secondary};
  margin-bottom: 0.375rem;
`;

interface Props extends InputBaseProps {
  label?: string;
  helperText?: string;
  InputProps?: StandardTextFieldProps['InputProps'];
  InputLabelProps?: StandardTextFieldProps['InputLabelProps'];
}

const TextField = ({ InputProps, InputLabelProps, helperText, error, ...props }: Props) => {
  return (
    <Stack spacing={0.5}>
      {props.label && <Label {...(InputLabelProps as any)}>{props.label}</Label>}
      <InputContainer isError={!!error || !!helperText}>
        <InputBase
          {...InputProps}
          {...props}
          value={props.value ?? ''}
          sx={{ color: theme.palette.text.primary, ...props.sx }}
        />
      </InputContainer>

      {helperText && (
        <Typography
          variant="caption"
          color="error"
          sx={{ px: 0.5, fontWeight: 500, fontSize: '0.75rem' }}
        >
          {helperText}
        </Typography>
      )}
    </Stack>
  );
};

export default TextField;
