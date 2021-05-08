FROM node:alpine AS build
WORKDIR /build
COPY package.json .
COPY .npmrc .npmrc

RUN yarn

COPY . .
RUN yarn build

FROM node:alpine
WORKDIR /app
COPY --from=build /build/dist ./dist
COPY --from=build /build/node_modules ./node_modules

ENTRYPOINT ["node", "dist"]
