FROM node as build
WORKDIR /build
COPY package.json .
RUN npm set registry http://127.0.0.1:4873/
RUN npm install
COPY . .
RUN npm run build
FROM nginx
COPY --from=build /build/dist /usr/share/nginx/html