<h1 align="center">PEFCL</h1>

<div align="center">

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC_BY--NC--SA_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
![Build](https://github.com/GlitchOo/pefcl/actions/workflows/prerelease.yml/badge.svg)

</div>

## Standalone
<img src="https://i.gyazo.com/b103593f655cb33e5e9598071635644f.png" width="90%">


## LB-Phone Integration
<img src="https://i.gyazo.com/e25f07a1a5d77d8e2804c6aaafddd532.png" width="30%" align="left">
<img src="https://i.gyazo.com/544800ce325a9a99a8737232577c8e09.png" width="30%" align="left">
<img src="https://i.gyazo.com/f8301522c7af28b21720e780ce22b577.png" width="30%" style="">

## LB-Tablet Integration
<img src="https://i.gyazo.com/1dde565a890e5329003e141d6fa6976c.png" width="45%" align="left">
<img src="https://i.gyazo.com/9da9ea3db6dbf3c6a0bbb98afc1396b2.png" width="45%" style="">


### Framework Bridges
QBX | https://github.com/DevX32/qbx_pefcl

QB-Core | https://github.com/project-error/qb-pefcl

ESX | https://github.com/project-error/pefcl-esx


### Installation
https://projecterror.dev/docs/pefcl/installation

### Configuration
https://projecterror.dev/docs/pefcl/configuration

### Developers
https://projecterror.dev/docs/pefcl/developers/introduction

## Local Development (Mocked)

For faster iteration, you can run a mocked version of the server and the web interface in your browser. This requires [Bun](https://bun.sh/) and Docker.

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    bun install
    ```
3.  **Start the database**:
    ```bash
    docker compose up -d
    ```
    *This starts a MySQL database as defined in `docker-compose.yml`.*
4.  **Run the development environment**:
    ```bash
    bun dev
    ```
    *This command runs Nx to start both the mock server and the Vite dev server for the frontend.*

The mock server will be listening on port `3005`, and the web interface will be available at the URL provided by Vite (usually `http://localhost:3002`).

## Additional Notes
Credits to the Project-Error Team and all of its contributors.

[PEFCL](https://github.com/project-error/pefcl)