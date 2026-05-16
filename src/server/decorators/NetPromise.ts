// src/server/decorators/NetPromise.ts
import { onNetPromise } from '../lib/onNetPromise';

export const NetPromise = (eventName: string) => {
  return (target: any, key: string) => {
    if (!target.__promiseEvents__) {
      target.__promiseEvents__ = [];
    }

    target.__promiseEvents__.push({
      eventName,
      key,
    });
  };
};

export const PromiseEventListener = () => (ctr: any) => ctr;

export const registerPromiseEvents = (instance: any) => {
  const promiseEvents: any[] = instance.__promiseEvents__ || instance.constructor.prototype.__promiseEvents__;
  if (!promiseEvents) return;

  for (const { eventName, key } of promiseEvents) {
    onNetPromise(eventName, async (...args: any[]) => {
      instance[key](...args);
    });
  }
};
