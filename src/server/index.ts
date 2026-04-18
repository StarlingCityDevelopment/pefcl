import './globals.server';
import type { ServerPromiseResp } from '@project-error/pe-utils';
import {
  AccountEvents,
  CardEvents,
  CashEvents,
  ExternalAccountEvents,
  GeneralEvents,
  InvoiceEvents,
  NUIEvents,
  SharedAccountEvents,
  TransactionEvents,
  UserEvents,
} from '@typings/Events';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { type RequestHandler } from 'express';
import 'reflect-metadata';

/* Create associations after the models etc */
import './services/associations';
import { Bank } from './services/Bank';
import './services/controllers';
import './utils/i18n';
import { load } from './utils/i18n';
import './utils/pool';
import './utils/server-config';
import { container } from 'tsyringe';
import { mockedResourceName } from './globals.server';
import { CardService } from './services/card/card.service';
import { UserService } from './services/user/user.service';
import { mainLogger } from './sv_logger';
import { seedDatabase } from './utils/mockSeed';
import { sequelize } from './utils/pool';
import { config } from './utils/server-config';

const hotReloadConfig = {
  resourceName: GetCurrentResourceName(),
  files: ['/src/dist/server.js', '/src/dist/client.js', '/src/dist/html/index.js'],
};

if (GetResourceState('hotreload') === 'started') {
  exports.hotreload?.add?.(hotReloadConfig);
}

new Bank().bootstrap();

const isMocking = process.env.NODE_ENV === 'mocking';
type BaseData = {
  data: unknown;
};

const createEndpoint = (eventName: string): [string, RequestHandler] => {
  const endpoint = `/${eventName.replace(':', '-')}`;
  const responseEventName = `${eventName}-response`;

  return [
    endpoint,
    async (req, res) => {
      emitNet(eventName, responseEventName, req.body);
      const result = await new Promise((resolve) => {
        onceNet(responseEventName, (_source: number, data: ServerPromiseResp<BaseData>) => {
          resolve(data);
        });
      });

      return res.send(result);
    },
  ];
};

if (isMocking) {
  const app = express();
  const port = 3005;
  app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
  app.use(bodyParser.json());

  app.get('/', (_req, res) => res.send('Mock server is up!'));
  app.post('/', (_req, res) => res.send('This is a mocked version of the Fivem Server.'));

  const eventsToMock = [
    // NUI
    NUIEvents.Loaded,
    NUIEvents.Unloaded,
    NUIEvents.SetCardId,
    NUIEvents.SetCards,
    // User
    UserEvents.Loaded,
    UserEvents.Unloaded,
    UserEvents.LoadClient,
    UserEvents.GetUsers,
    // Accounts
    AccountEvents.GetAccounts,
    AccountEvents.GetAtmAccount,
    AccountEvents.DeleteAccount,
    AccountEvents.SetDefaultAccount,
    AccountEvents.CreateAccount,
    AccountEvents.RenameAccount,
    AccountEvents.WithdrawMoney,
    AccountEvents.DepositMoney,
    // Transactions
    TransactionEvents.Get,
    TransactionEvents.CreateTransfer,
    TransactionEvents.GetHistory,
    // Invoices
    InvoiceEvents.Get,
    InvoiceEvents.CountUnpaid,
    InvoiceEvents.CreateInvoice,
    InvoiceEvents.PayInvoice,
    // Shared Accounts
    SharedAccountEvents.AddUser,
    SharedAccountEvents.RemoveUser,
    SharedAccountEvents.GetUsers,
    // External Accounts
    ExternalAccountEvents.Add,
    ExternalAccountEvents.Get,
    // Cash
    CashEvents.GetMyCash,
    // Cards
    CardEvents.Get,
    CardEvents.OrderPersonal,
    CardEvents.OrderShared,
    CardEvents.UpdatePin,
    CardEvents.Block,
    CardEvents.Delete,
    CardEvents.GetInventoryCards,
  ];

  for (const event of eventsToMock) {
    app.post(...createEndpoint(event));
  }

  app.listen(port, async () => {
    const srvLogger = mainLogger.child({ module: 'server' });
    srvLogger.info(`[MOCKSERVER]: listening on port: ${port}`);

    srvLogger.info('Syncing database...');
    await sequelize.sync({ force: true });
    await seedDatabase();

    emit('onServerResourceStart', mockedResourceName);

    if (config.frameworkIntegration?.enabled) {
      global.source = 3;
      const userService = container.resolve(UserService);

      const players = [
        {
          source: 3,
          name: 'John Doe',
          identifier: 'custom-character-identifier:john-doe',
        },
        {
          source: 4,
          name: 'Second Player',
          identifier: 'custom-character-identifier:john-other',
        },
      ];

      for (const player of players) {
        userService.loadPlayer(player);
      }
    }
  });
}

const debug = async () => {
  // RegisterCommand(
  //   'giveBankBalance',
  //   (src: number) => {
  //     const accountService = container.resolve(AccountService);
  //     const amount = Math.ceil(Math.random() * 1000);
  //     console.log('---------------');
  //     console.log('---------------');
  //     console.log({ amount });
  //     console.log('---------------');
  //     console.log('---------------');
  //     accountService.setMoney({ data: { amount }, source: src });
  //   },
  //   false,
  // );
  //
  //
  //
  //
  // const accountService = container.resolve(AccountService);
  // accountService.handleWithdrawMoney({
  //   source: 2,
  //   data: {
  //     amount: 200,
  //     message: 'Withdraw',
  //   },
  // });
  //
  //
  //
  //
  //
  // const invoiceController = container.resolve(InvoiceController);
  // invoiceController.createInvoice(
  //   {
  //     data: {
  //       amount: 200,
  //       to: 'John Doe',
  //       from: 'Repair Company',
  //       fromIdentifier: 'license:2',
  //       toIdentifier: 'license:1',
  //       message: 'Another one',
  //     },
  //     source: 0,
  //   },
  //   () => {},
  // );
  // const invoiceService = container.resolve(InvoiceService);
  // const invoice = await invoiceService.createInvoice({
  //   amount: 200,
  //   to: 'John doe',
  //   from: 'Repair shop AB',
  //   message: 'meme',
  //   toIdentifier: 'license:1',
  //   fromIdentifier: 'license:2',
  // });
  // await invoiceService.payInvoice({
  //   data: {
  //     invoiceId: invoice.getDataValue('id'),
  //     fromAccountId: 2,
  //   },
  //   source: 0,
  // });

  RegisterCommand(
    'card',
    async (src: number) => {
      const exps = exports;
      const QBCore = await exps['qb-core']?.GetCoreObject();

      await exps['qb-core'].RemoveItem('bank_card');

      const item = {
        name: 'bank_card',
        label: 'Bank card',
        weight: 1,
        type: 'item',
        image: 'visacard.png',
      };

      await exps['qb-core'].AddItem('bank_card', item);

      const cardService = container.resolve(CardService);

      const res = await cardService.giveCard(src, QBCore);

      console.log(res);
    },
    false,
  );
};

on(GeneralEvents.ResourceStarted, debug);
load();
