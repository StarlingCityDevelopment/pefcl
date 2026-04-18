import AccountCards, { LoadingCards } from '@components/AccountCards';
import Layout from '@components/Layout';
import TotalBalance from '@components/TotalBalance';
import { Skeleton } from '@components/ui/Base';
import { Typography } from '@components/ui/Typography';
import { transactionsTotalAtom } from '@data/transactions';
import React from 'react';
import { useTranslation } from 'react-i18next';
import DashboardContainer, { DashboardContainerFallback } from './components/DashboardContainer';
import DashboardSummary from './components/Summary';
import Transactions from './components/Transactions';

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className='flex flex-col gap-5'>
        <React.Suspense
          fallback={
            <div className='flex flex-col gap-2'>
              <Skeleton className='w-20 h-4 rounded-sm' />
              <Skeleton className='w-52 h-10 rounded-md' />
            </div>
          }
        >
          <TotalBalance />
        </React.Suspense>

        <React.Suspense fallback={<LoadingCards hideCreate />}>
          <AccountCards hideCreate />
        </React.Suspense>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-4 mt-6'>
        <React.Suspense fallback={<DashboardContainerFallback title={t('Loading transactions')} />}>
          <DashboardSummary />
        </React.Suspense>

        <React.Suspense fallback={<DashboardContainerFallback title={t('Loading transactions')} />}>
          <DashboardContainer
            title={t('Latest transactions')}
            viewAllRoute='/transactions'
            totalAtom={transactionsTotalAtom}
          >
            <Transactions />
          </DashboardContainer>
        </React.Suspense>
      </div>
    </Layout>
  );
};

export default Dashboard;
