import React from 'react';
import './mobile.module.css';
import styled from '@emotion/styled';
import theme from '@utils/theme';
import MobileFooter, { FooterHeight } from './Components/MobileFooter';
import MobileRoutes from './Routes';
import { Box } from '@mui/system';
import { Heading6 } from '@components/ui/Typography/Headings';
import { CircularProgress, Stack } from '@mui/material';

const Container = styled.div`
  color: ${theme.palette.text.primary};
  background: ${theme.palette.background.default};
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const ContentScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-top: 20px;
  padding-bottom: ${FooterHeight};

  /* Hide scrollbar */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

interface LoadingFallbackProps {
  message: string;
}

const LoadingFallback = (props: LoadingFallbackProps) => (
  <Box
    sx={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Stack spacing={2} alignItems="center">
      <CircularProgress size={32} thickness={3} />
      <Heading6 sx={{ opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {props.message}
      </Heading6>
    </Stack>
  </Box>
);

const MobileApp = () => {
  return (
    <Container>
      <ContentScroll>
        <React.Suspense fallback={<LoadingFallback message={'Getting data...'} />}>
          <MobileRoutes />
        </React.Suspense>
      </ContentScroll>
      <MobileFooter />
    </Container>
  );
};

export default MobileApp;
