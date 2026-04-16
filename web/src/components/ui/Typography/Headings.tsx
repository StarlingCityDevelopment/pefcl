import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import theme from '../../../utils/theme';

const BaseHeading = styled(Typography)`
  font-family: ${theme.typography.fontFamily};
  color: ${theme.palette.text.primary};
`;

export const Heading1 = styled(BaseHeading)`
  font-size: 2.5rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.15;
`;

export const Heading2 = styled(BaseHeading)`
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
`;

export const Heading3 = styled(BaseHeading)`
  font-size: 1.375rem;
  font-weight: 600;
  letter-spacing: -0.015em;
  line-height: 1.3;
`;

export const Heading4 = styled(BaseHeading)`
  font-size: 1.125rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.35;
`;

export const Heading5 = styled(BaseHeading)`
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.4;
  color: ${theme.palette.text.secondary};
`;

export const Heading6 = styled(BaseHeading)`
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  line-height: 1.5;
  color: ${theme.palette.text.secondary};
`;
