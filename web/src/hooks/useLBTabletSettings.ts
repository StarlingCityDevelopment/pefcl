import type { Resource } from 'solid-js';
import type { LBSettings } from "@typings/LBAddons";
import { LBTabletSettingsResource } from "@data/LBTabletSettings";

export const useLBTabletSettings = (): Resource<LBSettings | null> => {
  return LBTabletSettingsResource;
};
