import { LBPhoneSettingsAtom } from '@data/LBPhoneSettings';
import type { LBSettings } from '@typings/LBAddons';
import { useAtom } from 'jotai';

export const useLBPhoneSettings = (): LBSettings | null => {
  const [settings] = useAtom(LBPhoneSettingsAtom);
  return settings;
};
