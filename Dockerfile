FROM nginx

COPY ./bin/startup.sh /docker-entrypoint.d/credentials.sh
RUN chmod u+x /docker-entrypoint.d/credentials.sh

COPY build /usr/share/nginx/html
COPY config.nginx /etc/nginx/nginx.conf

ENV CI_COMMIT_SHORT_SHA=$CI_COMMIT_SHORT_SHA

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
