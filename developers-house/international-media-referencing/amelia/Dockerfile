FROM timbru31/java-node AS build
WORKDIR /build
COPY package.json .
RUN yarn

COPY . .
RUN yarn build

FROM node:alpine
WORKDIR /app
COPY --from=build /build/dist ./dist
COPY --from=build /build/node_modules ./node_modules
ENV NODE_ENV=production
ENTRYPOINT ["node", "dist/src"]
