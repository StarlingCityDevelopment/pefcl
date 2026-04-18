import styled from '@emotion/styled';
import { Box, CircularProgress, Stack } from '@mui/material';
import Button from '@ui/Button';
import { Heading6 } from '@ui/Typography/Headings';
import { type Atom, useAtom } from 'jotai';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import theme from '../../../utils/theme';

const Container = styled.div`
  padding: 1.25rem;
  background-color: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
`;

const Header = styled(Stack)`
  padding: 0 0.25rem;
`;

const TotalBadge = styled.div`
  background: rgba(255, 255, 255, 0.04);
  color: ${theme.palette.text.secondary};
  padding: 1px 6px;
  border-radius: 5px;
  font-size: 0.6875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

const Content = styled.div`
  flex: 1;
  max-height: 22rem;
  overflow-y: auto;
  padding-right: 2px;
`;

interface DashboardContainerProps {
  title: string;
  children?: React.ReactNode;
  totalAtom: Atom<number>;
  viewAllRoute: string;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({ title, children, totalAtom, viewAllRoute }) => {
  const [total] = useAtom(totalAtom);
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Container>
      <Header direction='row' justifyContent='space-between' alignItems='center'>
        <Stack direction='row' spacing={1} alignItems='center'>
          <Heading6
            sx={{
              fontWeight: 600,
              fontSize: '0.6875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: theme.palette.text.secondary,
            }}
          >
            {title}
          </Heading6>
          <TotalBadge>{total}</TotalBadge>
        </Stack>
        <Button
          size='small'
          variant='text'
          onClick={() => navigate(viewAllRoute)}
          sx={{
            fontSize: '0.75rem',
            padding: '4px 8px',
            color: theme.palette.primary.main,
            '&:hover': {
              background: 'rgba(59, 130, 246, 0.06)',
            },
          }}
        >
          {t('View all')}
        </Button>
      </Header>

      <Content>
        <Stack spacing={0.75}>{children}</Stack>
      </Content>
    </Container>
  );
};

export const DashboardContainerFallback: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Container>
      <Header direction='row' justifyContent='space-between' alignItems='center'>
        <Heading6
          sx={{
            fontWeight: 600,
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {title}
        </Heading6>
      </Header>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={20} thickness={2.5} sx={{ color: 'rgba(255, 255, 255, 0.15)' }} />
      </Box>
    </Container>
  );
};

export default DashboardContainer;
