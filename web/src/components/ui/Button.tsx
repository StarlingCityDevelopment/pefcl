import styled from '@emotion/styled';
import { Button as MuiButton, ButtonProps, alpha } from '@mui/material';
import React from 'react';
import theme from '../../utils/theme';

const StyledButton = styled(MuiButton)<ButtonProps>`
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.01em;
  padding: 0.625rem 1.5rem;
  border-radius: 10px;
  font-size: 0.875rem;
  transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
  box-shadow: none;
  position: relative;

  ${({ variant, color = 'primary' }) => {
    const paletteColor = (theme.palette as any)[color]?.main || theme.palette.primary.main;

    if (variant === 'text') {
      return `
        background: transparent;
        color: ${paletteColor};
        border: none;
        padding: 0.5rem 1rem;

        &:hover {
          background: ${alpha(paletteColor, 0.06)};
        }

        &:active {
          transform: scale(0.97);
        }
      `;
    }

    // Default contained style
    return `
      background: ${alpha(paletteColor, 0.1)};
      color: ${paletteColor};
      border: 1px solid ${alpha(paletteColor, 0.15)};

      &:hover {
        background: ${alpha(paletteColor, 0.15)};
        border-color: ${alpha(paletteColor, 0.3)};
      }

      &:active {
        transform: scale(0.97);
      }

      &.Mui-disabled {
        background: rgba(255, 255, 255, 0.03);
        color: ${theme.palette.text.secondary};
        border-color: transparent;
        opacity: 0.4;
      }
    `;
  }}
`;

const Button: React.FC<ButtonProps> = ({ children, variant = 'contained', ...props }) => {
  return (
    <StyledButton {...props} variant={variant} disableRipple>
      {children}
    </StyledButton>
  );
};

export default Button;
