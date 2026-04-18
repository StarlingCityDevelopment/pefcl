import styled from '@emotion/styled';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import theme from '@utils/theme';
import { motion } from 'motion/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heading2, Heading5, Heading6 } from './ui/Typography/Headings';

const Content = styled(motion.div)<{ children?: React.ReactNode }>`
  position: relative;
  padding: 2rem 2.5rem;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
`;

const pageVariants = {
  initial: {
    opacity: 0,
    filter: 'blur(4px)',
    transform: 'scale(0.995)',
  },
  animate: {
    opacity: 1,
    filter: 'blur(0px)',
    transform: 'scale(1)',
  },
  exit: {
    opacity: 0,
    filter: 'blur(4px)',
    transform: 'scale(0.995)',
  },
};

interface LayoutProps {
  title?: string;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { t } = useTranslation();

  return (
    <Content
      initial='initial'
      animate='animate'
      exit='exit'
      variants={pageVariants}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {title && (
        <Box mb={4}>
          <Heading2>{title}</Heading2>
        </Box>
      )}

      <React.Suspense
        fallback={
          <LoadingContainer>
            <CircularProgress size={20} thickness={2.5} sx={{ color: 'rgba(255, 255, 255, 0.15)' }} />
            <Heading6
              sx={{
                color: theme.palette.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontSize: '0.6875rem',
              }}
            >
              {t('Securely loading {{name}}', { name: title || '' })}
            </Heading6>
          </LoadingContainer>
        }
      >
        {children}
      </React.Suspense>
    </Content>
  );
};

export default Layout;
