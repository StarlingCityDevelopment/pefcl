// web/src/data/LBTabletSettings.ts
import type { LBSettings } from "@typings/LBAddons";
import { createResource, createRoot } from 'solid-js';

export const [LBTabletSettingsResource] = createRoot(() => createResource<LBSettings | null>(async () => {
  return window.GetSettings != null ? await window.GetSettings() : null;
}));
