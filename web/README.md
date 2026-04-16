# Frontend (NUI) Application

The PEFCL frontend is a React application built with TypeScript and **Vite**. It functions as the "NUI" (Native User Interface) within FiveM.

## Directory Structure

- **`/src/components`**: Reusable UI components (buttons, modals, layouts).
- **`/src/views`**: The main screens of the application (Dashboard, Transactions, Invoices, etc.).
- **`/src/data`**: State management using **Jotai** atoms. This directory handles data fetching and local state.
- **`/src/hooks`**: Custom React hooks for shared logic.
- **`/src/utils`**: Frontend-specific utilities, including `fetchNui` (which handles communication with the game or mock server).

## Communication

The frontend uses a custom `fetchNui` utility. 
- **In-game**: It calls `SendMessageToGame` to communicate with the FiveM client.
- **Browser (Mock mode)**: If it detects it's running in a browser, it sends a standard HTTP POST request to the mock server (port 3005).

## Mock Data

When running in the browser, if an API call fails or is explicitly configured for mocking, the application uses local constants from `src/utils/constants.ts` to ensure a functional UI during development.
