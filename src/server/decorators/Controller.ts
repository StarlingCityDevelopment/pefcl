import { DIToken } from '@typings/common';
import { singleton } from 'tsyringe';
import type { constructor as Ctor } from 'tsyringe/dist/typings/types';
import { Bank } from '../services/Bank';

export function Controller<T>(name: string) {
  return (target: Ctor<T>) => {
    target.prototype.name = name;

    singleton()(target);
    Bank.container.registerSingleton(DIToken.Controller, target);
  };
}
