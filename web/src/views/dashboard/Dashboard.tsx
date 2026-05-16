// web/src/views/dashboard/Dashboard.tsx
import AccountCards, { LoadingCards } from "@components/AccountCards";
import Layout from "@components/Layout";
import TotalBalance from "@components/TotalBalance";
import { Skeleton } from "@components/ui/Base";
import { transactionsTotal } from "@data/transactions";
import { Suspense } from 'solid-js';
import i18n from "@utils/i18n";
import DashboardContainer, { DashboardContainerFallback } from "./components/DashboardContainer";
import DashboardSummary from "./components/Summary";
import Transactions from "./components/Transactions";

const Dashboard = () => {
  return (
    <Layout>
      <div class='flex flex-col gap-5'>
        <Suspense
          fallback={
            <div class='flex flex-col gap-2'>
              <Skeleton class='w-20 h-4 rounded-sm' />
              <Skeleton class='w-52 h-10 rounded-md' />
            </div>
          }
        >
          <TotalBalance />
        </Suspense>

        <Suspense fallback={<LoadingCards hideCreate />}>
          <AccountCards hideCreate />
        </Suspense>
      </div>

      <div class='grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-4 mt-6'>
        <Suspense fallback={<DashboardContainerFallback title={i18n.t('Loading summary')} />}>
          <DashboardSummary />
        </Suspense>

        <Suspense fallback={<DashboardContainerFallback title={i18n.t('Loading transactions')} />}>
          <DashboardContainer
            title={i18n.t('Latest transactions')}
            viewAllRoute='/transactions'
            total={transactionsTotal}
          >
            <Transactions />
          </DashboardContainer>
        </Suspense>
      </div>
    </Layout>
  );
};

export default Dashboard;
