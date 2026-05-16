//@ts-check

import { exists, exec, getFiles } from './utils.js';
import { createBuilder, createFxmanifest } from '@communityox/fx-utils';
import { transform } from '@swc/core';
import { readFile } from 'fs/promises';

const watch = process.argv.includes('--watch');
const web = await exists('./web');
const dropLabels = ['$BROWSER'];

if (!watch) dropLabels.push('$DEV');

/** @type {any} */
const swcPlugin = {
  name: 'swc-decorator-metadata',
  // @ts-ignore
  setup(build) {
    // @ts-ignore
    build.onLoad({ filter: /src[\\/](server|common)[\\/].*\.ts$/ }, async (args) => {
      const input = await readFile(args.path, 'utf8');
      const { code } = await transform(input, {
        filename: args.path,
        sourceMaps: true,
        jsc: {
          parser: {
            syntax: 'typescript',
            decorators: true,
          },
          transform: {
            legacyDecorator: true,
            decoratorMetadata: false,
          },
          target: 'es2022',
        },
      });
      return { contents: code };
    });
  },
};

createBuilder(
  watch,
  {
    keepNames: true,
    legalComments: 'inline',
    bundle: true,
    treeShaking: true,
    plugins: [swcPlugin],
    external: ['pg', 'pg-hstore', 'sqlite3', 'tedious', 'mariadb'],
  },
  [
    {
      name: 'server',
      options: {
        platform: 'node',
        target: ['node22'],
        format: 'cjs',
        dropLabels: [...dropLabels, '$CLIENT'],
        plugins: [swcPlugin],
        external: ['pg', 'pg-hstore', 'sqlite3', 'tedious', 'mariadb'],
      },
    },
    {
      name: 'client',
      options: {
        platform: 'browser',
        target: ['es2021'],
        format: 'iife',
        dropLabels: [...dropLabels, '$SERVER'],
      },
    },
  ],
  async (outfiles) => {
    const files = await getFiles('dist/web', 'web/media');
    await createFxmanifest({
      client_scripts: [outfiles.client, 'interaction.lua'],
      server_scripts: [outfiles.server],
      files: [...files, 'config.json'],
      dependencies: ['/server:13068', '/onesync', 'qbx_pefcl'],
      metadata: {
        ui_page: 'dist/web/index.html',
        node_version: '22'
      },
    });

    if (web && !watch) await exec("cd web && bunx vite build");
  }
);
