FROM node as build

WORKDIR /build

COPY package.json .
RUN yarn

COPY . .
RUN yarn build

FROM nginx
COPY --from=build /build/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
