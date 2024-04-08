FROM node:18-slim

# Docker TAG is needed inside the runner - it creates new docker images and it needs to know
# which tags to use for these images (`stage` or `prod`)
ARG DOCKER_TAG
ENV DOCKER_TAG ${DOCKER_TAG}

WORKDIR /app

RUN npm install -g pnpm

# Install dependencies
RUN apt-get update && apt-get install -y curl # for healthcheck
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/docker-runner/package.json packages/docker-runner/
COPY packages/runner-common/package.json packages/runner-common/
RUN pnpm install --frozen-lockfile

# Copy the source code
COPY . .

WORKDIR /app/packages/docker-runner

ENV NODE_ENV production
EXPOSE 7009

CMD [ "npm", "start"]
