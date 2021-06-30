FROM node:lts-alpine
WORKDIR /app

COPY package.json .
COPY .npmrc .
COPY build .

RUN npm install --production

ENTRYPOINT ["node", "server.js"]
