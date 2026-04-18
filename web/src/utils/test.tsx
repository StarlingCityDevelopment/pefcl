import { render } from '@testing-library/react';
import { type MemoryHistory, createMemoryHistory } from 'history';
import type { Resource } from 'i18next';
/* eslint-disable react/display-name */
import React from 'react';
import { type ReactElement, type ReactNode, Suspense } from 'react';
import { Router } from 'react-router';

const renderWithRouter = (history: MemoryHistory) => (ui: ReactNode) => {
  return (
    <Router navigator={history} location={history.location}>
      {ui}
    </Router>
  );
};

const renderWithSuspense = (ui: ReactNode) => {
  return <Suspense fallback={<div>loading..</div>}>{ui}</Suspense>;
};

type RenderWithProvidersOptions = {
  resources?: Resource;
  history?: MemoryHistory;
};

export const renderWithProviders = (ui: ReactElement, options?: RenderWithProvidersOptions) => {
  const history = options?.history ?? createMemoryHistory();

  /* From bottom, to top. Lowest = rendered furthest out. */
  const providers = [renderWithRouter(history), renderWithSuspense];

  const renderedElement = providers.reduce((prevUi, provider) => {
    return provider(prevUi);
  }, ui);

  return render(renderedElement);
};
