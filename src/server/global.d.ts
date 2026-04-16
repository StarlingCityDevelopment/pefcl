declare global {
  function onceNet(eventName: string, handler: (...args: any[]) => void): void;
  function removeEventListener(eventName: string, handler: (...args: any[]) => void): void;
  function removeNetEventListener(eventName: string, handler: (...args: any[]) => void): void;

  namespace NodeJS {
    interface Global {
      onceNet: typeof onceNet;
      removeEventListener: typeof removeEventListener;
      removeNetEventListener: typeof removeNetEventListener;
    }
  }
}

export {};
