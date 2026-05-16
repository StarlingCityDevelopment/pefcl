import defaultConfig from '../../../static/config.json';
import type { ResourceConfig } from '../../../typings/config';
import { getResourceName, isEnvBrowser } from './misc';

export const getConfig = async (): Promise<ResourceConfig> => {
  if (isEnvBrowser()) {
    return defaultConfig;
  }

  const resourceName = getResourceName();
  const tryFetch = async (url: string) => {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (err) { }
    return null;
  };

  const config =
    (await tryFetch(`https://cfx-nui-${resourceName}/config.json`)) ||
    (await tryFetch(`nui://${resourceName}/config.json`)) ||
    (await tryFetch(`./config.json`)) ||
    (await tryFetch(`../../config.json`));

  if (config) {
    return config;
  }

  console.warn('Failed to fetch config from server, falling back to default');
  return defaultConfig;
};
