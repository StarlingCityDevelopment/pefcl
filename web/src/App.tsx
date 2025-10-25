import Devbar from '@components/DebugBar';
import { accountsAtom, rawAccountAtom } from '@data/accounts';
import { transactionBaseAtom, transactionInitialState } from '@data/transactions';
import styled from '@emotion/styled';
import { BroadcastsWrapper } from '@hooks/useBroadcasts';
import { useExitListener } from '@hooks/useExitListener';
import { useNuiEvent } from '@hooks/useNuiEvent';
import { GeneralEvents, NUIEvents, UserEvents } from '@typings/Events';
import { fetchNui } from '@utils/fetchNui';
import dayjs from 'dayjs';
import 'dayjs/locale/sv';
import updateLocale from 'dayjs/plugin/updateLocale';
import { useSetAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route } from 'react-router';
import './App.css';
import { useConfig } from './hooks/useConfig';
import theme from './utils/theme';
import ATM from './views/ATM/ATM';
import Deposit from './views/Deposit/Deposit';
import Invoices from './views/Invoices/Invoices';
import Withdraw from './views/Withdraw/Withdraw';
import Accounts from './views/accounts/Accounts';
import Dashboard from './views/dashboard/Dashboard';
import Transactions from './views/transactions/Transactions';
import Transfer from './views/transfer/Transfer';
import CardsView from './views/Cards/CardsView';
import MobileApp from './views/Mobile/Mobile';
import { useGlobalSettings } from '@hooks/useGlobalSettings';
import { useLBPhoneSettings } from '@hooks/useLBPhoneSettings';
import { useLBTabletSettings } from '@hooks/useLBTabletSettings';

dayjs.extend(updateLocale);

const Container = styled.div`
  padding: 4rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 1400px;
  height: 800px;
  overflow: hidden;
  border-radius: 1rem;
  color: ${theme.palette.text.primary};
  background: ${theme.palette.background.default};
`;

const App: React.FC = () => {
  const config = useConfig();
  const setRawAccounts = useSetAtom(rawAccountAtom);
  const setAccounts = useSetAtom(accountsAtom);
  const setTransactions = useSetAtom(transactionBaseAtom);
  const [isAtmVisible, setIsAtmVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { isMobile } = useGlobalSettings();
  const LBPhoneSettings = useLBPhoneSettings();
  const LBTabletSettings = useLBTabletSettings();

  const [hasLoaded, setHasLoaded] = useState(process.env.NODE_ENV === 'development' || isMobile);

  useNuiEvent('PEFCL', UserEvents.Loaded, () => setHasLoaded(true));
  useNuiEvent('PEFCL', UserEvents.Unloaded, () => {
    setHasLoaded(false);
    setAccounts([]);
    setRawAccounts([]);
    setTransactions();
    fetchNui(GeneralEvents.CloseUI);
    setTransactions(transactionInitialState);
  });

  useEffect(() => {
    fetchNui(NUIEvents.Loaded);
    return () => {
      fetchNui(NUIEvents.Unloaded);
    };
  }, []);

  useNuiEvent('PEFCL', 'setVisible', (data) => setIsVisible(data as boolean));
  useNuiEvent('PEFCL', 'setVisibleATM', (data) => setIsAtmVisible(data as boolean));

  const { i18n } = useTranslation();
  useExitListener(isVisible);

  useEffect(() => {
    i18n
      .changeLanguage(
        LBPhoneSettings?.locale ?? LBTabletSettings?.locale ?? config?.general?.language,
      )
      .catch((e) => console.error(e));
  }, [i18n, config, LBPhoneSettings, LBTabletSettings]);

  useEffect(() => {
    dayjs.locale(
      LBPhoneSettings?.locale ?? LBTabletSettings?.locale ?? config?.general?.language ?? 'en',
    );
  }, [i18n, config, LBPhoneSettings, LBTabletSettings]);

  if (!hasLoaded) {
    return null;
  }

  return (
    <>
      {process.env.NODE_ENV === 'development' && <Devbar />}

      <React.Suspense fallback={'Loading bank'}>
        {!isAtmVisible && isVisible && (
          <Container>
            <Content>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="accounts" element={<Accounts />} />
                <Route path="transactions" element={<Transactions />} />
                {/* <Route path="invoices" element={<Invoices />} /> */}
                <Route path="transfer" element={<Transfer />} />
                <Route path="deposit" element={<Deposit />} />
                <Route path="withdraw" element={<Withdraw />} />
                <Route path="cards" element={<CardsView />} />
              </Routes>
            </Content>
          </Container>
        )}
      </React.Suspense>

      <React.Suspense fallback={null}>
        <ATM />
      </React.Suspense>

      {isMobile && (
        <React.Suspense fallback={null}>
          <Routes>
            <Route path="*" element={<MobileApp />} />
          </Routes>
        </React.Suspense>
      )}

      {/* No fallback needed for BroadcastsWrapper as it renders nothing visible */}
      <React.Suspense fallback={null}>
        <BroadcastsWrapper />
      </React.Suspense>
    </>
  );
};

export default App;
