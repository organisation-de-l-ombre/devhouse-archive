# syntax = docker/dockerfile:experimental
FROM node as build
WORKDIR /build
COPY package.json .
RUN yarn
COPY . .
RUN yarn build
RUN cp ormconfig.prod.json build/ormconfig.json

FROM node
WORKDIR /scarlet
COPY --from=build /build/node_modules ./node_modules
COPY --from=build /build/build .

RUN --mount=type=secret,id=auto-devops-build-secrets . /run/secrets/auto-devops-build-secrets

CMD node index
