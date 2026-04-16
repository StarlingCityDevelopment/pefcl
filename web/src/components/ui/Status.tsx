import { SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import { ChipProps, css } from '@mui/material';
import theme from '@utils/theme';
import React from 'react';
import { BodyText } from './Typography/BodyText';

type Color = Exclude<ChipProps['color'], undefined>;

const colors: Record<Color, SerializedStyles> = {
  default: css`
    color: ${theme.palette.text.secondary};
  `,
  primary: css`
    color: ${theme.palette.primary.main};
    background-color: rgba(59, 130, 246, 0.08);
    border-color: rgba(59, 130, 246, 0.15);
  `,
  secondary: css``,
  error: css`
    color: ${theme.palette.error.main};
    background-color: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.15);
  `,
  info: css``,
  success: css`
    color: ${theme.palette.success.main};
    background-color: rgba(52, 211, 153, 0.08);
    border-color: rgba(52, 211, 153, 0.15);
  `,
  warning: css`
    color: ${theme.palette.warning.main};
    background-color: rgba(251, 191, 36, 0.08);
    border-color: rgba(251, 191, 36, 0.15);
  `,
};

const Container = styled.div<{ color: Color }>`
  text-transform: uppercase;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.06);

  color: ${theme.palette.text.primary};
  background-color: rgba(255, 255, 255, 0.04);

  span {
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.04em;
  }

  ${({ color }) => colors[color]}
`;

interface StatusProps {
  label: string;
  color: Color;
}
const Status: React.FC<StatusProps> = (props) => {
  return (
    <Container color={props.color}>
      <BodyText>{props.label}</BodyText>
    </Container>
  );
};

export default Status;
