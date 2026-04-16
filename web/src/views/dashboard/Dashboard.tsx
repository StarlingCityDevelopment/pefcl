import styled from '@emotion/styled';
import { Skeleton, Stack } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { transactionsTotalAtom } from '@data/transactions';
import Layout from '@components/Layout';
import theme from '@utils/theme';
import DashboardContainer, { DashboardContainerFallback } from './components/DashboardContainer';
import Transactions from './components/Transactions';
import DashboardSummary from './components/Summary';
import AccountCards, { LoadingCards } from '@components/AccountCards';
import TotalBalance from '@components/TotalBalance';
import { PreHeading } from '@components/ui/Typography/BodyText';
import { Heading1 } from '@components/ui/Typography/Headings';

const Lists = styled.section`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  margin-top: ${theme.spacing(2.5)};
  grid-column-gap: ${theme.spacing(2)};
`;

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <Stack spacing={3}>
        <React.Suspense
          fallback={
            <Stack>
              <PreHeading>
                <Skeleton variant="text" width={80} height={18} />
              </PreHeading>
              <Heading1>
                <Skeleton variant="text" width={200} height={48} />
              </Heading1>
            </Stack>
          }
        >
          <TotalBalance />
        </React.Suspense>

        <React.Suspense fallback={<LoadingCards hideCreate />}>
          <AccountCards hideCreate />
        </React.Suspense>
      </Stack>

      <Lists>
        <React.Suspense fallback={<DashboardContainerFallback title={t('Loading transactions')} />}>
          <DashboardSummary />
        </React.Suspense>

        <React.Suspense fallback={<DashboardContainerFallback title={t('Loading transactions')} />}>
          <DashboardContainer
            title={t('Latest transactions')}
            viewAllRoute="/transactions"
            totalAtom={transactionsTotalAtom}
          >
            <Transactions />
          </DashboardContainer>
        </React.Suspense>
      </Lists>
    </Layout>
  );
};

export default Dashboard;
