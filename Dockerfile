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
ARG CI_COMMIT_SHORT_SHA
ENV CI_COMMIT_SHORT_SHA=$CI_COMMIT_SHORT_SHA

RUN --mount=type=secret,id=auto-devops-build-secrets . /run/secrets/auto-devops-build-secrets

CMD node index
