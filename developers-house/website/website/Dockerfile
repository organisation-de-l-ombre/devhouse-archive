# production environment
FROM node:alpine as build
WORKDIR /build
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
ENV PUBLIC_URL=https://dhcdn25ftr.b-cdn.net
RUN yarn build

FROM nginx:stable-alpine
COPY --from=build /build/build /usr/share/nginx/html
COPY config.nginx /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
