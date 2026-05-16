// web/src/views/Mobile/Routes.tsx
import { Route } from "@solidjs/router";
import { lazy } from 'solid-js';

const MobileAccountsView = lazy(() => import('./views/Accounts/MobileAccountsView'));
const MobileDashboardView = lazy(() => import('./views/Dashboard/MobileDashboardView'));
const MobileInvoicesView = lazy(() => import('./views/Invoices/MobileInvoicesView'));
const MobileTransferView = lazy(() => import('./views/Transfer/MobileTransferView'));

const MobileRoutes = () => {
  return (
    <>
      <Route path='mobile/accounts' component={MobileAccountsView} />
      <Route path='mobile/dashboard' component={MobileDashboardView} />
      <Route path='mobile/transfer' component={MobileTransferView} />
      <Route path='mobile/invoices' component={MobileInvoicesView} />
    </>
  );
};

export default MobileRoutes;
