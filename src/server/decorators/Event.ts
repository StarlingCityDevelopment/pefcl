export const OnEvent = (eventName: string) => {
  return (target: object, key: string): void => {
    if (!Reflect.hasMetadata('events', target)) {
      Reflect.defineMetadata('events', [], target);
    }

    const netEvents = Reflect.getMetadata('events', target) as Array<any>;

    netEvents.push({
      eventName,
      key: key,
      net: false,
    });

    Reflect.defineMetadata('events', netEvents, target);
  };
};

export const NetEvent = (eventName: string) => {
  return (target: any, key: string): void => {
    if (!Reflect.hasMetadata('events', target)) {
      Reflect.defineMetadata('events', [], target);
    }

    const netEvents = Reflect.getMetadata('events', target) as Array<any>;

    netEvents.push({
      eventName,
      key: key,
      net: true,
    });

    Reflect.defineMetadata('events', netEvents, target);
  };
};

export const EventListener = () => (ctor: any) => ctor;

export const registerEvents = (instance: any) => {
  const events = Reflect.getMetadata('events', instance) as Array<any>;
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
