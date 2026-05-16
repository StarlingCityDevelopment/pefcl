import type { Resource } from 'solid-js';
import type { LBSettings } from "@typings/LBAddons";
import { LBPhoneSettingsResource } from "@data/LBPhoneSettings";

export const useLBPhoneSettings = (): Resource<LBSettings | null> => {
  return LBPhoneSettingsResource;
};
