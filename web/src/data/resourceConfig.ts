// web/src/data/resourceConfig.ts
import type { ResourceConfig } from "@typings/config";
import { createResource, createRoot } from 'solid-js';
import { getConfig } from "@utils/api";

export const [configResource] = createRoot(() => createResource<ResourceConfig>(async () => {
  return await getConfig();
}));
