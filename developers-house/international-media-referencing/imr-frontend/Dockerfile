FROM node:lts-alpine
WORKDIR /app

COPY package.json .
COPY .npmrc .
COPY build /app/build

RUN npm install --production

ENV PORT=3200

EXPOSE 3200

ENTRYPOINT ["node", "build/server.js"]
