import { render } from 'solid-js/web';
import { HashRouter, Route } from "@solidjs/router";
import './index.css';
import { GlobalSettingsProvider, useGlobalSettings } from "@hooks/useGlobalSettings";
import App from './App';
import './utils/i18n';
import { lazy, Suspense, Show } from 'solid-js';

const Dashboard = lazy(() => import('./views/dashboard/Dashboard'));
const Accounts = lazy(() => import('./views/accounts/Accounts'));
const Transactions = lazy(() => import('./views/transactions/Transactions'));
const Invoices = lazy(() => import('./views/Invoices/Invoices'));
const Transfer = lazy(() => import('./views/transfer/Transfer'));
const Deposit = lazy(() => import('./views/Deposit/Deposit'));
const Withdraw = lazy(() => import('./views/Withdraw/Withdraw'));
const CardsView = lazy(() => import('./views/Cards/CardsView'));

const MobileDashboardView = lazy(() => import('./views/Mobile/views/Dashboard/MobileDashboardView'));
const MobileAccountsView = lazy(() => import('./views/Mobile/views/Accounts/MobileAccountsView'));
const MobileInvoicesView = lazy(() => import('./views/Mobile/views/Invoices/MobileInvoicesView'));
const MobileTransferView = lazy(() => import('./views/Mobile/views/Transfer/MobileTransferView'));

const ResponsiveView = (props: { desktop: any, mobile?: any }) => {
  const { isMobile } = useGlobalSettings();
  const Desktop = props.desktop;
  const Mobile = props.mobile || props.desktop;
  return (
    <Show when={isMobile()} fallback={<Desktop />}>
      <Mobile />
    </Show>
  );
};

const container = document.getElementById('root');
if (!container) {
  throw new Error('Failed to find the root element');
}

render(
  () => (
    <GlobalSettingsProvider>
      <HashRouter root={App}>
        <Route path='/' component={() => <ResponsiveView desktop={Dashboard} mobile={MobileDashboardView} />} />
        <Route path='/accounts' component={() => <ResponsiveView desktop={Accounts} mobile={MobileAccountsView} />} />
        <Route path='/transactions' component={() => <ResponsiveView desktop={Transactions} />} />
        <Route path='/invoices' component={() => <ResponsiveView desktop={Invoices} mobile={MobileInvoicesView} />} />
        <Route path='/transfer' component={() => <ResponsiveView desktop={Transfer} mobile={MobileTransferView} />} />
        <Route path='/deposit' component={() => <ResponsiveView desktop={Deposit} />} />
        <Route path='/withdraw' component={() => <ResponsiveView desktop={Withdraw} />} />
        <Route path='/cards' component={() => <ResponsiveView desktop={CardsView} />} />
      </HashRouter>
    </GlobalSettingsProvider>
  ),
  container,
);
