// src/server/decorators/Controller.ts

export function Controller<T>(name: string) {
  return (target: any) => {
    target.prototype.name = name;
  };
}
