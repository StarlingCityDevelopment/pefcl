import { useAtom } from 'jotai';
import { LBSettings } from '@typings/LBAddons';
import { LBPhoneSettingsAtom } from '@data/LBPhoneSettings';

export const useLBPhoneSettings = (): LBSettings | null => {
  const [settings] = useAtom(LBPhoneSettingsAtom);
  return settings;
};
