import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { GlobalSettingsProvider } from '@hooks/useGlobalSettings';
import { ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { NuiProvider } from 'react-fivem-hooks';
import { I18nextProvider } from 'react-i18next';
import { HashRouter } from 'react-router';
import App from './App';
import i18n from './utils/i18n';
import theme from './utils/theme';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <NuiProvider>
      <GlobalSettingsProvider>
        <I18nextProvider i18n={i18n}>
          <HashRouter>
            <ThemeProvider theme={theme}>
              <SnackbarProvider maxSnack={2}>
                <React.Suspense fallback={<div>Fetching app</div>}>
                  <App />
                </React.Suspense>
              </SnackbarProvider>
            </ThemeProvider>
          </HashRouter>
        </I18nextProvider>
      </GlobalSettingsProvider>
    </NuiProvider>
  </React.StrictMode>,
);
