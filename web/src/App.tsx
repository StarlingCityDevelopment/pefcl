// web/src/App.tsx
import Devbar from "@components/DebugBar";
import Shell from "@components/layout/Shell";
import { setRawAccounts, refetchAccounts } from "@data/accounts";
import { refetchTransactions } from "@data/transactions";
import { BroadcastsWrapper } from "@hooks/useBroadcasts";
import { useExitListener } from "@hooks/useExitListener";
import { useGlobalSettings } from "@hooks/useGlobalSettings";
import { useLBPhoneSettings } from "@hooks/useLBPhoneSettings";
import { useLBTabletSettings } from "@hooks/useLBTabletSettings";
import { useNuiEvent } from "@hooks/useNuiEvent";
import { GeneralEvents, NUIEvents, UserEvents } from "@typings/Events";
import { fetchNui } from "@utils/fetchNui";
import dayjs from 'dayjs';
import 'dayjs/locale/sv';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(updateLocale);
import { createSignal, onMount, onCleanup, createEffect, Suspense, Show, lazy } from 'solid-js';
import { Route, useNavigate, useLocation, type RouteSectionProps } from "@solidjs/router";
import i18n from "@utils/i18n";
import { useConfig } from "@hooks/useConfig";
import './App.css';

const ATM = lazy(() => import('./views/ATM/ATM'));
const MobileApp = lazy(() => import('./views/Mobile/Mobile'));

const App = (props: RouteSectionProps) => {
  const config = useConfig();
  const [isAtmVisible, setIsAtmVisible] = createSignal(false);
  const [isVisible, setIsVisible] = createSignal(process.env.NODE_ENV === 'development');
  const { isMobile } = useGlobalSettings();
  const LBPhoneSettings = useLBPhoneSettings();
  const LBTabletSettings = useLBTabletSettings();

  const [hasLoaded, setHasLoaded] = createSignal(process.env.NODE_ENV === 'development' || isMobile());

  useNuiEvent(UserEvents.Loaded, () => setHasLoaded(true));
  useNuiEvent(UserEvents.Unloaded, () => {
    setHasLoaded(false);
    setRawAccounts([]);
    refetchAccounts();
    refetchTransactions();
    fetchNui(GeneralEvents.CloseUI);
  });

  onMount(() => {
    fetchNui(NUIEvents.Loaded);
    onCleanup(() => {
      fetchNui(NUIEvents.Unloaded);
    });
  });

  useNuiEvent('setVisible', (data) => {
    setIsVisible(data as boolean);
    if (data) setHasLoaded(true);
  });
  useNuiEvent('setVisibleATM', (data) => {
    setIsAtmVisible(data as boolean);
    if (data) setHasLoaded(true);
  });

  useExitListener(isVisible);

  createEffect(() => {
    const lang = LBPhoneSettings()?.locale ?? LBTabletSettings()?.locale ?? config()?.general?.language;
    if (lang && i18n.isInitialized && i18n.language !== lang) {
      i18n.changeLanguage(lang).catch((e) => console.error(e));
      dayjs.locale(lang);
    }
  });

  return (
    <Show when={hasLoaded()}>
      <Show when={process.env.NODE_ENV === 'development'}>
        <Devbar />
      </Show>

      <Suspense fallback={<div class='flex items-center justify-center min-h-screen bg-black text-white font-bold uppercase tracking-widest text-[10px]'>Initializing...</div>}>
        <Show when={isAtmVisible()}>
          <ATM />
        </Show>

        <Show when={!isAtmVisible() && isMobile()}>
           <MobileApp>{props.children}</MobileApp>
        </Show>

        <Show when={!isAtmVisible() && isVisible() && !isMobile()}>
          <Shell>{props.children}</Shell>
        </Show>
      </Suspense>

      <BroadcastsWrapper />
    </Show>
  );
};

export default App;
