// src/server/services/account/__tests__/account.controller.test.ts
/// <reference types="jest" />
import {
  type ATMInput,
  AccountRole,
  AccountType,
  type CreateAccountInput,
  type ExternalAccount,
} from '@server/../../typings/Account';
import { AccountEvents, ExternalAccountEvents, SharedAccountEvents } from '@server/../../typings/Events';
import { AccountController } from '../account.controller';
import type { RemoveFromSharedAccountInput } from '../account.db';
import { AccountService } from '../account.service';

import { ExternalAccountService } from '../../accountExternal/externalAccount.service';

jest.mock('../account.service');

jest.mock('../../accountExternal/externalAccount.service');

const accountService = new AccountService({} as any, {} as any, {} as any, {} as any, {} as any, {} as any, {} as any);
const controller = new AccountController(accountService, externalAccountService);

const src = 80085;
beforeEach(() => {
  jest.resetAllMocks();
  global.source = src;
});

const auth = async () => {
  expect(controller._accountService.getAuthorizedAccount).toHaveBeenCalledTimes(1);
};

describe('Controller: account', () => {
  describe('AccountEvents:', () => {
    test('AccountEvents.GetAccounts', () => {
      global.source = 4;
      emitNet(AccountEvents.GetAccounts, 'resp');
      expect(controller._accountService.handleGetMyAccounts).toHaveBeenCalledWith(4);
    });

    test('AccountEvents.CreateAccount', () => {
      const payload: CreateAccountInput = {
        accountName: 'Latest and greatest',
        isDefault: true,
        ownerIdentifier: 'license:1',
        type: AccountType.Personal,
      };

      emitNet(AccountEvents.CreateAccount, 'resp', payload);
      expect(controller._accountService.handleCreateAccount).toHaveBeenCalledWith({
        data: payload,
        source: src,
      });
    });

    test('AccountEvents.DeleteAccount', async () => {
      const payload = {
        accountId: 1,
      };

      emitNet(AccountEvents.DeleteAccount, 'resp', payload);

      await auth();
      expect(controller._accountService.handleDeleteAccount).toHaveBeenCalledWith({
        data: payload,
        source: src,
      });
    });

    test('AccountEvents.DepositMoney', () => {
      const payload: ATMInput = {
        amount: 2,
        message: 'Example',
      };

      emitNet(AccountEvents.DepositMoney, 'resp', payload);
      expect(controller._accountService.handleDepositMoney).toHaveBeenCalledWith({
        data: payload,
        source: src,
      });
    });

    test('AccountEvents.WithdrawMoney', () => {
      const payload: ATMInput = {
        amount: 2,
        message: 'Example',
      };

      emitNet(AccountEvents.WithdrawMoney, 'resp', payload);
      expect(controller._accountService.handleWithdrawMoney).toHaveBeenCalledWith({
        data: payload,
        source: src,
      });
    });

    test('AccountEvents.SetDefaultAccount', async () => {
      const payload = {
        accountId: 4,
      };

      emitNet(AccountEvents.SetDefaultAccount, 'resp', payload);

      await auth();
      expect(controller._accountService.handleSetDefaultAccount).toHaveBeenCalledWith({
        data: payload,
        source: src,
      });
    });

    test('AccountEvents.RenameAccount', async () => {
      const payload = {
        accountId: 4,
      };

      emitNet(AccountEvents.RenameAccount, 'resp', payload);

      await auth();
      expect(controller._accountService.handleRenameAccount).toHaveBeenCalledWith({
        data: payload,
        source: src,
      });
    });
  });

  describe('SharedAccountEvents:', () => {
    test('SharedAccountEvents.AddUser', async () => {
      const payload = {
        accountId: 4,
      };

      emitNet(SharedAccountEvents.AddUser, 'resp', payload);

      await auth();
      expect(controller._accountService.addUserToShared).toHaveBeenCalledWith({
        data: payload,
        source: src,
      });
    });

    test('SharedAccountEvents.RemoveUser', async () => {
      const payload: RemoveFromSharedAccountInput = {
        accountId: 4,
        identifier: 'license2',
      };

      emitNet(SharedAccountEvents.RemoveUser, 'resp', payload);

      await auth();
      expect(controller._accountService.removeUserFromShared).toHaveBeenCalledWith({
        data: payload,
        source: src,
      });
    });

    test('SharedAccountEvents.GetUsers', async () => {
      const payload = {
        accountId: 4,
      };

      emitNet(SharedAccountEvents.GetUsers, 'resp', payload);

      expect(await controller._accountService.getAuthorizedAccount).toHaveBeenCalledWith(src, 4, [
        AccountRole.Admin,
        AccountRole.Contributor,
      ]);

      expect(controller._accountService.getUsersFromShared).toHaveBeenCalledWith({
        data: payload,
        source: src,
      });
    });
  });

  describe('ExternalAccountEvents:', () => {
    test('ExternalAccountEvents.Add', () => {
      const payload: ExternalAccount = {
        id: 1,
        name: 'Source 1',
        number: '920,1500-2500-3500',
      };

      emitNet(ExternalAccountEvents.Add, 'resp', payload);

      expect(controller._externalAccountService.handleAddAccount).toHaveBeenCalledWith({
        data: payload,
        source: src,
      });
    });

    test('ExternalAccountEvents.Get', () => {
      emitNet(ExternalAccountEvents.Get, 'resp');
      expect(controller._externalAccountService.getAccounts).toHaveBeenCalledWith({
        data: undefined,
        source: src,
      });
    });
  });
});
