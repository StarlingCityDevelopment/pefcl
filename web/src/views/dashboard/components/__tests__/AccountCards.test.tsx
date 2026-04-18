import React from 'react';
import '@testing-library/jest-dom';
import AccountCards from '@components/AccountCards';
import { screen, waitFor } from '@testing-library/react';
import { mockedAccounts } from '@utils/constants';
import { renderWithProviders } from '@utils/test';

jest.mock('@utils/fetchNui', () => ({
  fetchNui: () => [mockedAccounts[0], mockedAccounts[1]],
}));

const Loading = () => {
  return <div data-testid='loading' />;
};
describe('Component: <AccountCards />', () => {
  test('should display add card button', async () => {
    renderWithProviders(
      <React.Suspense fallback={<Loading />}>
        <AccountCards />
      </React.Suspense>,
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());
    expect(screen.getByTitle('create-account')).toBeInTheDocument();
  });

  test('should display cards', async () => {
    renderWithProviders(
      <React.Suspense fallback={<Loading />}>
        <AccountCards />
      </React.Suspense>,
    );

    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());
    expect(screen.getByText(mockedAccounts[0].accountName)).toBeInTheDocument();
  });
});
