// src/server/services/Bank.ts
import { mainLogger } from '../sv_logger';

const baseLogger = mainLogger.child({ module: 'base' });

import { registerEvents } from '../decorators/Event';
import { registerExports } from '../decorators/Export';
import { registerPromiseEvents } from '../decorators/NetPromise';
import { Registry } from './registry';

export class Bank {
  bootstrap() {
    baseLogger.debug('Initializing controllers...');

    const controllers = Registry.getInstance().getControllers();

    for (const controller of controllers) {
      // @ts-ignore
      baseLogger.debug(`Initializing ${controller.name || controller.constructor.name} controller`);
      registerEvents(controller);
      registerExports(controller);
      registerPromiseEvents(controller);
    }
  }
}
