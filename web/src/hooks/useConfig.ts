import { useAtom } from 'jotai';
import type { ResourceConfig } from '../../../typings/config';
import { configAtom } from '../data/resourceConfig';

export const useConfig = (): ResourceConfig => {
 const [config] = useAtom(configAtom);
 return config;
};
