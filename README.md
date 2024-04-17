# AgorApp Solana

This is a monorepo containing packages that add support for Solana chain to [agorapp.dev](https://agorapp.dev/)

## Quick Start

```bash
# Install dependencies
pnpm install

# Start dev-editor
pnpm run dev

# Start solana-runner
cd packages/solana-runner
make docker-build
make run

# Run docker runner to use the image built in the previous step
cd packages/docker-runner
pnpm run dev
```
