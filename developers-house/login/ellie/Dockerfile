# syntax = docker/dockerfile:experimental
FROM node:14 as build
WORKDIR /build
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn compile

FROM node:14
WORKDIR /usr/bin/app
COPY --from=build /build/dist .
COPY --from=build /build/node_modules node_modules
COPY --from=build /build/package.json .

RUN --mount=type=secret,id=auto-devops-build-secrets . /run/secrets/auto-devops-build-secrets

CMD node index
