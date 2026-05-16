import type { Account } from '@server/../../typings/Account';
import type { Card } from '@server/../../typings/BankCard';
import type { Cash } from '@server/../../typings/Cash';
import type { Transaction } from '@server/../../typings/Transaction';
import { Controller } from '@server/decorators/Controller';
import { EventListener, OnEvent } from '@server/decorators/Event';
import { BroadcastService } from './broadcast.service';

import { AccountEvents, CardEvents, CashEvents, TransactionEvents } from '@server/../../typings/Events';

@Controller('Broadcast')
@EventListener()
export class BroadcastController {
  broadcastService: BroadcastService;
  constructor(broadcastService: BroadcastService) {
    this.broadcastService = broadcastService;
  }

  @OnEvent(AccountEvents.NewBalance)
  async onNewBalance(account: Account) {
    this.broadcastService.broadcastNewDefaultAccountBalance(account);
  }

  @OnEvent(AccountEvents.NewBalance)
  async onNewAccountBalance(account: Account) {
    this.broadcastService.broadcastNewAccountBalance(account);
  }

  @OnEvent(AccountEvents.NewAccountCreated)
  async onNewAccountCreation(account: Account) {
    this.broadcastService.broadcastUpdatedAccount(account);
  }

  @OnEvent(AccountEvents.AccountDeleted)
  async onAccountDeleted(account: Account) {
    this.broadcastService.broadcastUpdatedAccount(account);
  }

  @OnEvent(CashEvents.NewCash)
  async onNewCash(cash: Cash) {
    this.broadcastService.broadcastNewCash(cash);
  }

  @OnEvent(TransactionEvents.NewTransaction)
  async onNewTransaction(transaction: Transaction) {
    this.broadcastService.broadcastTransaction(transaction);
  }

  @OnEvent(CardEvents.NewCard)
  async onNewCard(card: Card) {
    this.broadcastService.broadcastNewCard(card);
  }
}
