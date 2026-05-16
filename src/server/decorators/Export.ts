// src/server/decorators/Export.ts
import type { Request } from '@typings/http';

export const Export = (name: string) => {
  return (target: any, key: string) => {
    if (!target.__exports__) {
      target.__exports__ = [];
    }

    target.__exports__.push({
      name,
      key,
    });
  };
};

const exp = global.exports;

export const ExportListener = () => (ctor: any) => ctor;

export const registerExports = (instance: any) => {
  const _exports: any[] = instance.__exports__ || instance.constructor.prototype.__exports__;
  if (!_exports) return;

  _exports.forEach(({ name, key }) => {
    exp(name, async (source: number, data: unknown, cb: (data: unknown) => void) => {
      const payload: Request = {
        data,
        source,
      };

      const result = await new Promise((resolve) => {
        return instance[key](payload, resolve);
      });

      cb?.(result);

      return new Promise((resolve) => {
        resolve(result);
      });
    });
  });
};
