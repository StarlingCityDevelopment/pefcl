import type { LBSettings } from "@typings/LBAddons";

declare global {
  interface Window {
    invokeNative(): void;
    GetParentResourceName?: () => string;
    GetSettings?: () => Promise<LBSettings>;
  }
}

// and not CEF
export const isEnvBrowser = (): boolean => !window.invokeNative;
export const getResourceName = () => (window as any).GetParentResourceName ? (window as any).GetParentResourceName() : 'pefcl';

// Basic no operation function
export const noop = () => {};
