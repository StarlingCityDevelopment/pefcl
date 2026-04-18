import { AccountDB } from '@services/account/account.db';
import { SharedAccountDB } from '@services/accountShared/sharedAccount.db';
import type { AccountRole } from '@typings/Account';
import { GenericErrors } from '@typings/Errors';
import { ServerError } from '@utils/errors';
import { singleton } from 'tsyringe';
import { mainLogger } from '../../sv_logger';
import { UserService } from '../user/user.service';

const logger = mainLogger.child({ module: 'auth' });

@singleton()
export class AuthService {
  _accountDB: AccountDB;
  _userService: UserService;
  _sharedAccountDB: SharedAccountDB;

  constructor(accountDB: AccountDB, userService: UserService, sharedAccountDB: SharedAccountDB) {
    this._accountDB = accountDB;
    this._userService = userService;
    this._sharedAccountDB = sharedAccountDB;
  }

  async isAuthorizedAccount(accountId: number, source: number, roles: AccountRole[]): Promise<void> {
    const user = this._userService.getUser(source);
    const identifier = user.getIdentifier();

    logger.debug(`Authorizing user ${identifier} for account: ${accountId}`);

    const account =
      (await this._accountDB.getAuthorizedAccountById(accountId, identifier)) ??
      (await this._sharedAccountDB.getAuthorizedSharedAccountById(accountId, identifier, roles));

    if (!account) {
      throw new ServerError(GenericErrors.NotFound);
    }
  }
}
