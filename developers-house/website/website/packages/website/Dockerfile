FROM node as build
WORKDIR /build
ARG NPM_CONFIG_REGISTRY
ENV NPM_CONFIG_REGISTRY=${NPM_CONFIG_REGISTRY}
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
FROM nginx
COPY --from=build /build/dist /usr/share/nginx/html