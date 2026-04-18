import { LBTabletSettingsAtom } from '@data/LBTabletSettings';
import type { LBSettings } from '@typings/LBAddons';
import { useAtom } from 'jotai';

export const useLBTabletSettings = (): LBSettings | null => {
 const [settings] = useAtom(LBTabletSettingsAtom);
 return settings;
};
