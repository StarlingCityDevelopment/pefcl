import defaultConfig from '../../../static/config.json';
import type { ResourceConfig } from '../../../typings/config';
import { getResourceName, isEnvBrowser } from './misc';

export const getConfig = async (): Promise<ResourceConfig> => {
 if (isEnvBrowser()) {
 return defaultConfig;
 }

 const resourceName = getResourceName();
 const config = await fetch(`https://cfx-nui-${resourceName}/static/config.json`).then((res) => res.json());

 return config;
};
