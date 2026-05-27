# 600_theme_utilsrv

Utility service package for the J1 development monorepo.

## What it does today

- Exposes `utilsrv` and `develop` scripts so Lerna can run package 600.
- Emits startup diagnostics compatible with historical README examples.
- Exits cleanly when `server_enabled` is `false`.

## Quick run

```sh
yarn workspace utilsrv run utilsrv
```

or from repository root:

```sh
yarn utilsrv
```
