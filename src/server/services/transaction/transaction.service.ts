import { mainLogger } from '@server/sv_logger';
import { sequelize } from '@server/utils/pool';
import { SharedAccountDB } from '@services/accountShared/sharedAccount.db';
import { AccountRole } from '@typings/Account';
import { BalanceErrors, GenericErrors } from '@typings/Errors';
import { TransactionEvents } from '@typings/Events';
import {
  type CreateTransferInput,
  type GetTransactionHistoryResponse,
  type GetTransactionsInput,
  type GetTransactionsResponse,
  type TransactionInput,
  TransactionType,
  TransferType,
} from '@typings/Transaction';
import type { Request } from '@typings/http';
import { MS_ONE_WEEK } from '@utils/constants';
import { ServerError } from '@utils/errors';
import type { Transaction as SequelizeTransaction } from 'sequelize/types';
import { AccountDB } from '../account/account.db';
import { ExternalAccountService } from '../accountExternal/externalAccount.service';
import { UserService } from '../user/user.service';
import { TransactionDB } from './transaction.db';
import { TransactionModel } from './transaction.model';

const logger = mainLogger.child({ module: 'transactionService' });

export class TransactionService {
  _accountDB: AccountDB;
  _sharedAccountDB: SharedAccountDB;
  _transactionDB: TransactionDB;
  _userService: UserService;
  constructor(
    transactionDB: TransactionDB,
    userService: UserService,
    accountDB: AccountDB,
    sharedAccountDB: SharedAccountDB,
  ) {
    this._transactionDB = transactionDB;
    this._userService = userService;
    this._accountDB = accountDB;
    this._sharedAccountDB = sharedAccountDB;
  }

  private async getMyTransactions(req: Request<GetTransactionsInput>) {
    logger.silly('Getting transactions');
    logger.silly(req);

    const user = this._userService.getUser(req.source);
    const accounts = await this._accountDB.getAccountsByIdentifier(user.getIdentifier());
    const sharedAccounts = await this._sharedAccountDB.getSharedAccountsByIdentifier(user.getIdentifier());

    const sharedAccountIds = sharedAccounts.map((account) => account.getDataValue('accountId') ?? 0);
    const accountIds = accounts.map((account) => account.getDataValue('id') ?? 0);

    const transactions = await this._transactionDB.getTransactionFromAccounts({
      ...req.data,
      accountIds: [...sharedAccountIds, ...accountIds],
    });

    const total = await this._transactionDB.getTotalTransactionsFromAccounts(accountIds);

    logger.silly(`Returned total of ${total} transactions.`);

    return {
      total: total,
      offset: req.data.offset,
      limit: req.data.limit,
      transactions: transactions,
    };
  }

  async handleGetMyTransactions(req: Request<GetTransactionsInput>): Promise<GetTransactionsResponse> {
    const data = await this.getMyTransactions(req);
    return {
      ...data,
      transactions: data.transactions.map((transaction) => transaction.toJSON()),
    };
  }



  async handleCreateTransaction(
    input: TransactionInput,
    sequelizeTransaction: SequelizeTransaction,
  ): Promise<TransactionModel | null> {
    logger.silly('Created transaction.');
    logger.silly(input);

    const transaction = await this._transactionDB.create(input, sequelizeTransaction);

    sequelizeTransaction.afterCommit(() => {
      logger.silly(`Emitting ${TransactionEvents.NewTransaction}`);
      emit(TransactionEvents.NewTransaction, { ...input, ...transaction.toJSON() });
    });

    return transaction;
  }

  async handleGetHistory(req: Request<void>): Promise<GetTransactionHistoryResponse> {
    const user = this._userService.getUser(req.source);
    const accounts = await this._accountDB.getAccountsByIdentifier(user.getIdentifier());

    const from = new Date(Date.now() - MS_ONE_WEEK);
    const accountIds = accounts.map((account) => account.getDataValue('id') ?? 0);
    const transactions = await this._transactionDB.getAllTransactionsFromAccounts(accountIds, from);

    const expenses = transactions.reduce((prev, curr) => {
      const type = curr.getDataValue('type');
      const amount = curr.getDataValue('amount');
      return type === TransactionType.Outgoing ? prev - amount : prev;
    }, 0);

    const income = transactions.reduce((prev, curr) => {
      const type = curr.getDataValue('type');
      const amount = curr.getDataValue('amount');
      return type === TransactionType.Incoming ? prev + amount : prev;
    }, 0);

    const lastWeek = transactions.reduce(
      (prev, curr) => {
        const date = new Date(curr.getDataValue('createdAt') ?? '');
        const type = curr.getDataValue('type');
        const amount = curr.getDataValue('amount');
        const isIncoming = type === TransactionType.Incoming;
        const isOutgoing = type === TransactionType.Outgoing;

        const localeDate = date.toDateString();

        const { income = 0, expenses = 0 } = prev[localeDate] ?? {};
        const newIncome = isIncoming ? income + amount : income;
        const newExpenses = isOutgoing ? expenses - amount : expenses;

        prev[localeDate] = {
          income: newIncome,
          expenses: newExpenses,
        };

        return prev;
      },
      {} as Record<string, { income: number; expenses: number }>,
    );

    return {
      income,
      lastWeek,
      expenses: expenses,
    };
  }
}
