FROM node
WORKDIR /app
COPY package.json package.json
COPY .npmrc .npmrc
RUN npm install --only=prod
COPY build /app
ENTRYPOINT [ "node", "server.js" ]