FROM node:lts as build
WORKDIR /build
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn compile

FROM node:lts-alpine
WORKDIR /usr/bin/app
COPY --from=build /build/dist .
COPY --from=build /build/node_modules node_modules
COPY --from=build /build/package.json .

CMD node index
