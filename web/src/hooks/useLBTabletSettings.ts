import { useAtom } from 'jotai';
import { LBSettings } from '@typings/LBAddons';
import { LBTabletSettingsAtom } from '@data/LBTabletSettings';

export const useLBTabletSettings = (): LBSettings | null => {
  const [settings] = useAtom(LBTabletSettingsAtom);
  return settings;
};
