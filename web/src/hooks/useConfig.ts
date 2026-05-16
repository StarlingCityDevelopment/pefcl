// web/src/hooks/useConfig.ts
import type { Resource } from 'solid-js';
import type { ResourceConfig } from '../../../typings/config';
import { configResource } from "@data/resourceConfig";

export const useConfig = (): Resource<ResourceConfig> => {
  return configResource;
};
