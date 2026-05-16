// src/server/decorators/Event.ts

export const OnEvent = (eventName: string) => {
  return (target: any, key: string): void => {
    if (!target.__events__) {
      target.__events__ = [];
    }

    target.__events__.push({
      eventName,
      key: key,
      net: false,
    });
  };
};

export const NetEvent = (eventName: string) => {
  return (target: any, key: string): void => {
    if (!target.__events__) {
      target.__events__ = [];
    }

    target.__events__.push({
      eventName,
      key: key,
      net: true,
    });
  };
};

export const EventListener = () => (ctor: any) => ctor;

export const registerEvents = (instance: any) => {
  const events = instance.__events__ || instance.constructor.prototype.__events__;
  if (!events) return;

  for (const { net, eventName, key } of events) {
    if (net)
      onNet(eventName, (...args: any[]) => {
        instance[key](...args);
      });
    else
      on(eventName, (...args: any[]) => {
        instance[key](...args);
      });
  }
};
