import type { ResourceConfig } from '@typings/config';
import { atom } from 'jotai';
import { getConfig } from '../utils/api';

export const configAtom = atom<Promise<ResourceConfig>>(async () => {
 return await getConfig();
});
