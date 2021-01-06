FROM node as build
WORKDIR /build
COPY package.json .
COPY .npmrc .
RUN npm i
COPY . .
RUN npm run build
RUN cp ormconfig.prod.json build/ormconfig.json

FROM node
WORKDIR /scarlet
COPY --from=build /build/node_modules ./node_modules
COPY --from=build /build/build .

CMD node index
