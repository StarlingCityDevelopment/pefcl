# Build and Maintenance Scripts

This directory contains scripts used for building, releasing, and maintaining the project.

## Key Scripts

- **`watch_server.js`**: Watches for changes in the server source code and triggers a rebuild (used during development).
- **`generateLocales.js`**: Consolidates translation files from the `locales` directory.
- **`release.sh` / `prerelease.sh`**: Scripts used to package the resource for distribution.

These scripts are typically invoked via `bun` commands defined in the root `package.json`.
