# Contributing to @tournamentsuite/sdk

## Getting started

```bash
git clone https://github.com/Tournament-Suite/sdk-js.git
cd sdk-js
npm install
```

## Building

```bash
npm run build
```

Output lands in `dist/`. The build uses [tsup](https://tsup.egoist.dev/) and emits both ESM and CJS bundles plus TypeScript declarations.

## Development

```bash
npm run dev
```

Watches for changes and rebuilds automatically.

## Running tests

```bash
npm test
```

## Submitting a PR

1. Fork the repository and create a feature branch from `main`.
2. Make your changes and ensure `npm run build` and `npm test` pass.
3. Run `npm run lint` and fix any reported issues.
4. Open a pull request against `main` with a clear description of what changed and why.

Please keep PRs focused — one feature or fix per PR makes review faster.