FROM node as build
WORKDIR /build
COPY package.json .
RUN npm set registry http://localhost:4873/
RUN npm install
COPY . .
RUN npm run build
FROM nginx
COPY --from=build /build/dist /usr/share/nginx/html