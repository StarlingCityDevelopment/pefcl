import { DIToken, type IController } from '@typings/common';
import { container } from 'tsyringe';
import { mainLogger } from '../sv_logger';

const baseLogger = mainLogger.child({ module: 'base' });

import { registerEvents } from '../decorators/Event';
import { registerExports } from '../decorators/Export';
import { registerPromiseEvents } from '../decorators/NetPromise';

export class Bank {
  static container = container;

  bootstrap() {
    Bank.container.beforeResolution(DIToken.Controller, () => {
      baseLogger.debug('Initializing...');
    });

    Bank.container.afterResolution(DIToken.Controller, (_t, controllers: IController[]) => {
      for (const controller of controllers) {
        baseLogger.debug(`Initializing ${controller.name} controller`);
        registerEvents(controller);
        registerExports(controller);
        registerPromiseEvents(controller);
      }
    });

    Bank.container.resolveAll(DIToken.Controller);
  }
}
