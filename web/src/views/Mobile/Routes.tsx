import React from 'react';
import { Routes, Route } from 'react-router';
import MobileAccountsView from './views/Accounts/MobileAccountsView';
import MobileDashboardView from './views/Dashboard/MobileDashboardView';
import MobileInvoicesView from './views/Invoices/MobileInvoicesView';
import MobileTransferView from './views/Transfer/MobileTransferView';

const MobileRoutes = () => {
  return (
    <Routes>
      <Route path="mobile/accounts" element={<MobileAccountsView />} />
      <Route path="mobile/dashboard" element={<MobileDashboardView />} />
      <Route path="mobile/transfer" element={<MobileTransferView />} />
      <Route path="mobile/invoices" element={<MobileInvoicesView />} />
    </Routes>
  );
};

export default MobileRoutes;
