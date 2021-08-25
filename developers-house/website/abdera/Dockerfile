FROM timbru31/java-node as build
WORKDIR /build
COPY package.json .
COPY .npmrc .npmrc
RUN yarn
COPY . .
RUN yarn build
RUN rm -r node_modules/@types

FROM node
WORKDIR /app
COPY package.json .
COPY --from=build /build/node_modules /app/node_modules
COPY --from=build /build/dist .
COPY data /app/data
ENTRYPOINT node index
