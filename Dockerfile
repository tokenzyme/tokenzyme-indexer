# BUILD STEP

FROM node:24-alpine AS build

ARG NODE_ENV="development"

WORKDIR /usr/src/tokenzyme-indexer

COPY .yarnrc.yml package.json tsconfig.json yarn.lock ./
COPY src src/

RUN corepack enable
RUN yarn install && yarn build

# MAIN STEP

FROM node:24-alpine

ARG NODE_ENV="production"

WORKDIR /usr/src/tokenzyme-indexer

COPY .yarnrc.yml package.json yarn.lock ./

RUN corepack enable
RUN yarn workspaces focus --production

COPY --from=build /usr/src/tokenzyme-indexer/lib ./lib

EXPOSE 3002

CMD ["yarn", "start:prod"]
