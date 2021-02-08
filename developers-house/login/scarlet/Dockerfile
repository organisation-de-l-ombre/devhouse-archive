FROM node:lts as build
ARG CI_JOB_TOKEN
WORKDIR /build
COPY package.json .
COPY .npmrc .
RUN echo "//gitlab.com/api/v4/packages/npm/:_authToken=${CI_JOB_TOKEN}">>.npmrc
RUN npm i
COPY . .
RUN npm run build
RUN cp ormconfig.prod.json build/ormconfig.json

FROM node:lts-alpine
WORKDIR /scarlet
COPY --from=build /build/node_modules ./node_modules
COPY --from=build /build/build .
CMD node index
