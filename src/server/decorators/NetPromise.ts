import { onNetPromise } from '../lib/onNetPromise';

export const NetPromise = (eventName: string) => {
  return (target: object, key: string) => {
    if (!Reflect.hasMetadata('promiseEvents', target)) {
      Reflect.defineMetadata('promiseEvents', [], target);
    }

    const promiseEvents = Reflect.getMetadata('promiseEvents', target);

    promiseEvents.push({
      eventName,
      key,
    });

    Reflect.defineMetadata('promiseEvents', promiseEvents, target);
  };
};

export const PromiseEventListener = () => (ctr: any) => ctr;

export const registerPromiseEvents = (instance: any) => {
  const promiseEvents: any[] = Reflect.getMetadata('promiseEvents', instance);
  if (!promiseEvents) return;

  for (const { eventName, key } of promiseEvents) {
    onNetPromise(eventName, async (...args: any[]) => {
      instance[key](...args);
    });
  }
};
