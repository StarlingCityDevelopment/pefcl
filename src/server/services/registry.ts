// src/server/services/registry.ts
import { AccountDB } from './account/account.db';
import { AccountService } from './account/account.service';
import { ExternalAccountDB } from './accountExternal/externalAccount.db';
import { ExternalAccountService } from './accountExternal/externalAccount.service';
import { SharedAccountDB } from './accountShared/sharedAccount.db';

import { BootService } from './boot/boot.service';
import { BroadcastService } from './broadcast/broadcast.service';
import { CardDB } from './card/card.db';
import { CardService } from './card/card.service';
import { CashDB } from './cash/cash.db';
import { CashService } from './cash/cash.service';
import { InvoiceDB } from './invoice/invoice.db';
import { InvoiceService } from './invoice/invoice.service';
import { TransactionDB } from './transaction/transaction.db';
import { TransactionService } from './transaction/transaction.service';
import { UserService } from './user/user.service';

// Controllers
import { AccountController } from './account/account.controller';
import { BootController } from './boot/boot.controller';
import { BroadcastController } from './broadcast/broadcast.controller';
import { CardController } from './card/card.controller';
import { CashController } from './cash/cash.controller';
import { InvoiceController } from './invoice/invoice.controller';
import { TransactionController } from './transaction/transaction.controller';
import { UserController } from './user/user.controller';

export class Registry {
  private static instance: Registry;

  // DBs
  public accountDB: AccountDB;
  public sharedAccountDB: SharedAccountDB;
  public externalAccountDB: ExternalAccountDB;
  public cardDB: CardDB;
  public cashDB: CashDB;
  public invoiceDB: InvoiceDB;
  public transactionDB: TransactionDB;

  // Services
  public userService: UserService;

  public cashService: CashService;
  public transactionService: TransactionService;
  public accountService: AccountService;
  public externalAccountService: ExternalAccountService;
  public cardService: CardService;
  public invoiceService: InvoiceService;
  public broadcastService: BroadcastService;
  public bootService: BootService;

  // Controllers
  public accountController: AccountController;
  public bootController: BootController;
  public broadcastController: BroadcastController;
  public cardController: CardController;
  public cashController: CashController;
  public invoiceController: InvoiceController;
  public transactionController: TransactionController;
  public userController: UserController;

  private constructor() {
    // 1. Initialize DBs (no dependencies usually)
    this.externalAccountDB = new ExternalAccountDB();
    this.accountDB = new AccountDB(this.externalAccountDB);
    this.sharedAccountDB = new SharedAccountDB();
    this.cardDB = new CardDB();
    this.cashDB = new CashDB();
    this.invoiceDB = new InvoiceDB();
    this.transactionDB = new TransactionDB();

    // 2. Initialize Services (ordered by dependency)
    this.userService = new UserService();

    this.cashService = new CashService(this.cashDB, this.userService);
    this.bootService = new BootService(this.userService);
    this.externalAccountService = new ExternalAccountService(this.externalAccountDB, this.userService, this.accountDB);

    this.transactionService = new TransactionService(
      this.transactionDB,
      this.userService,
      this.accountDB,
      this.sharedAccountDB
    );

    this.accountService = new AccountService(
      this.accountDB,
      this.sharedAccountDB,
      this.userService,
      this.cashService,
      this.transactionService,
      this.cardDB,
      this.externalAccountService
    );

    this.broadcastService = new BroadcastService(this.transactionDB, this.userService, this.accountService);
    
    this.cardService = new CardService(
      this.cardDB, 
      this.userService, 
      this.accountService, 
      this.accountDB
    );

    this.invoiceService = new InvoiceService(
      this.userService,
      this.invoiceDB,
      this.accountDB,
      this.transactionDB,
      this.transactionService
    );

    // 3. Initialize Controllers
    this.accountController = new AccountController(this.accountService, this.externalAccountService);
    this.bootController = new BootController(this.bootService);
    this.broadcastController = new BroadcastController(this.broadcastService);
    this.cardController = new CardController(this.cardService);
    this.cashController = new CashController(this.cashService);
    this.invoiceController = new InvoiceController(this.invoiceService, this.userService);
    this.transactionController = new TransactionController(this.transactionService);
    this.userController = new UserController(this.userService);
  }

  public static getInstance(): Registry {
    if (!Registry.instance) {
      Registry.instance = new Registry();
    }
    return Registry.instance;
  }

  public getControllers() {
    return [
      this.accountController,
      this.bootController,
      this.broadcastController,
      this.cardController,
      this.cashController,
      this.invoiceController,
      this.transactionController,
      this.userController,
    ];
  }
}
