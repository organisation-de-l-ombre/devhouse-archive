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

CMD node index