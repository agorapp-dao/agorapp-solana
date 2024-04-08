# AgorApp Solana

This is a monorepo containing packages that add support for Solana chain to [agorapp.dev](https://agorapp.dev/)

## Quick Start

```bash
# Install dependencies
pnpm install

# Start dev-editor
pnpm run dev

# Build docker image for Solana
cd packages/solana-docker-image
pnpm run docker-build

# Run docker runner to use the image built in the previous step
cd packages/docker-runner
pnpm run dev
```
