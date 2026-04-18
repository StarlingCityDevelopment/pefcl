import type { Request } from '@typings/http';
export const Export = (name: string) => {
  return (target: object, key: string) => {
    if (!Reflect.hasMetadata('exports', target)) {
      Reflect.defineMetadata('exports', [], target);
    }

    const _exports = Reflect.getMetadata('exports', target);

    _exports.push({
      name,
      key,
    });

    Reflect.defineMetadata('exports', _exports, target);
  };
};

const exp = global.exports;

export const ExportListener = () => (ctor: any) => ctor;

export const registerExports = (instance: any) => {
  const _exports: any[] = Reflect.getMetadata('exports', instance);
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
