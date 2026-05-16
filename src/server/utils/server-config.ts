// Setup and export config loaded at runtime
import type { DeepPartial, ResourceConfig } from '@typings/config';

const config: DeepPartial<ResourceConfig> = JSON.parse(
    LoadResourceFile(GetCurrentResourceName(), 'config.json'),
);

config.debug = {
    level: GetConvar('environment', 'production') === 'development' ? 'silly' : 'info'
};

export { config };