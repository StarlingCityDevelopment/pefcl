import { ThemeProvider, createTheme } from '@mui/material';
import { render } from '@testing-library/react';
import { type MemoryHistory, createMemoryHistory } from 'history';
import type { Resource } from 'i18next';
import { SnackbarProvider } from 'notistack';
/* eslint-disable react/display-name */
import React from 'react';
import { type ReactElement, type ReactNode, Suspense } from 'react';
import { Router } from 'react-router';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const renderWithRouter = (history: MemoryHistory) => (ui: ReactNode) => {
  return (
    <Router navigator={history} location={history.location}>
      {ui}
    </Router>
  );
};

const renderWithTheme = (ui: ReactNode) => {
  return <ThemeProvider theme={theme}>{ui}</ThemeProvider>;
};

const renderWithSuspense = (ui: ReactNode) => {
  return <Suspense fallback={<div>loading..</div>}>{ui}</Suspense>;
};

const renderWithSnackbar = (ui: ReactNode) => {
  return <SnackbarProvider>{ui}</SnackbarProvider>;
};

type RenderWithProvidersOptions = {
  resources?: Resource;
  history?: MemoryHistory;
};
export const renderWithProviders = (ui: ReactElement, options?: RenderWithProvidersOptions) => {
  const history = options?.history ?? createMemoryHistory();

  /* From bottom, to top. Lowest = rendered furthest out. */
  const providers = [renderWithRouter(history), renderWithSnackbar, renderWithSuspense, renderWithTheme];

  const renderedElement = providers.reduce((prevUi, provider) => {
    return provider(prevUi);
  }, ui);

  return render(renderedElement);
};
