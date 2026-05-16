import defaultConfig from '../../../static/config.json';
import type { ResourceConfig } from '../../../typings/config';
import { getResourceName, isEnvBrowser } from './misc';

export const getConfig = async (): Promise<ResourceConfig> => {
  if (isEnvBrowser()) {
    return defaultConfig;
  }

  const resourceName = getResourceName();
  try {
    let res = await fetch(`https://${resourceName}/config.json`);

    if (!res.ok && res.status === 404) {
      res = await fetch(`https://${resourceName}/static/config.json`);
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch config: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch config, falling back to default', err);
    return defaultConfig;
  }
};
