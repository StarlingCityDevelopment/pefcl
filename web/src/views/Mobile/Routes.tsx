import React from 'react';
import { Route } from 'react-router-dom';
import MobileAccountsView from './views/Accounts/MobileAccountsView';
import MobileDashboardView from './views/Dashboard/MobileDashboardView';
import MobileInvoicesView from './views/Invoices/MobileInvoicesView';
import MobileTransferView from './views/Transfer/MobileTransferView';

const MobileRoutes = () => {
  return (
    <>
      <Route path={`/mobile/accounts`} component={MobileAccountsView} />
      <Route path={`/mobile/dashboard`} component={MobileDashboardView} />
      <Route path={`/mobile/transfer`} component={MobileTransferView} />
      <Route path={`/mobile/invoices`} component={MobileInvoicesView} />
    </>
  );
};

export default MobileRoutes;
