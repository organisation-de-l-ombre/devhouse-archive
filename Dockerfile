FROM node
WORKDIR /app
COPY package.json package.json
COPY .npmrc .npmrc
RUN yarn --prod
COPY build /app
ENTRYPOINT [ "node", "server.js" ]