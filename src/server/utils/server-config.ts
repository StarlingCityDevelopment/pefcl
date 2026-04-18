// Setup and export config loaded at runtime
import type { DeepPartial, ResourceConfig } from '@typings/config';

export const config: DeepPartial<ResourceConfig> = JSON.parse(
  LoadResourceFile(GetCurrentResourceName(), 'static/config.json'),
);
