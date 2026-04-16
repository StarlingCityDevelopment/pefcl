import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import theme from '../../../utils/theme';

const BaseText = styled(Typography)`
  font-family: ${theme.typography.fontFamily};
`;

export const PreHeading = styled(BaseText)`
  font-size: 0.8125rem;
  font-weight: 400;
  color: ${theme.palette.text.secondary};
  line-height: 1.5;
`;

export const BodyText = styled(BaseText)`
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.6;
`;
