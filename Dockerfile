# production environment
FROM node as build
WORKDIR /build
COPY package.json .
RUN yarn
COPY . .
RUN yarn build

FROM nginx:stable-alpine
COPY --from=build /build/build /usr/share/nginx/html
COPY config.nginx /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
