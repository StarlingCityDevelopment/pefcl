# Server-side Logic

This directory contains the core backend logic for PEFCL. It is built using TypeScript and utilizes **Sequelize** for database ORM and a manual **Registry** pattern for dependency management.

## Directory Structure

- **`/decorators`**: Contains custom TypeScript decorators used to register controllers, event listeners, and NUI promises.
- **`/services`**: The heart of the application. Each subfolder (e.g., `account`, `transaction`, `invoice`) contains:
    - `*.model.ts`: Sequelize model definitions.
    - `*.db.ts`: Direct database access layer.
    - `*.service.ts`: Business logic that orchestrates DB calls and other services.
    - `*.controller.ts`: Handles incoming network events and routes them to services.
- **`/utils`**: Utility functions, including database pool configuration (`pool.ts`), configuration loader (`server-config.ts`), and localization (`i18n.ts`).
- **`globals.server.ts`**: Mocks FiveM environment variables and functions (like `emitNet`, `onNet`, `GetResourcePath`) when running in mocking mode.
- **`server.ts`**: The main entry point. In mocking mode, it starts an Express server to bridge HTTP requests from the browser to the internal event system.

## How it works (Mocking Mode)

When `NODE_ENV === 'mocking'`, `server.ts` starts an Express server on port 3005. It creates endpoints for every FiveM event defined in the system. When the frontend sends a POST request to one of these endpoints, the mock server:
1. Emits an internal event.
2. Waits for a response.
3. Synchronizes the database and seeds it with mock data if it's the first start.
4. Returns the result as JSON.
