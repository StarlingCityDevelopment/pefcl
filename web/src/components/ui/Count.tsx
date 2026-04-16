import styled from '@emotion/styled';
import theme from '@utils/theme';
import React from 'react';

const Total = styled.div<{ focus: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  height: 1.5rem;
  padding: 0 0.5rem;
  min-width: 1.5rem;

  border-radius: 6px;
  font-weight: 600;
  font-size: 0.75rem;
  background-color: rgba(255, 255, 255, 0.04);
  color: ${theme.palette.text.secondary};
  border: 1px solid rgba(255, 255, 255, 0.06);

  ${({ focus }) =>
    focus &&
    `
      background-color: rgba(255, 255, 255, 0.06);
      color: ${theme.palette.text.primary};
  `}
`;

import { Box, SxProps, Theme } from '@mui/material';

interface CountProps extends React.HTMLAttributes<HTMLDivElement> {
  amount: string | number;
  focus?: boolean;
  sx?: SxProps<Theme>;
}
const Count = ({ amount, focus = false, sx, ...props }: CountProps) => {
  return (
    <Box sx={sx} {...props}>
      <Total focus={focus}>{amount}</Total>
    </Box>
  );
};

export default Count;
