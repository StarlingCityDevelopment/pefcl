import { LBSettings } from '@typings/LBAddons';
import { atom } from 'jotai';

export const LBTabletSettingsAtom = atom<Promise<LBSettings | null>>(async () => {
  return window.GetSettings != null ? await window.GetSettings() : null;
});
