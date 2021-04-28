FROM nginx
RUN useradd www

COPY ./bin/startup.sh /docker-entrypoint.d/credentials.sh
RUN chmod u+x /docker-entrypoint.d/credentials.sh
RUN chown www /docker-entrypoint.d/credentials.sh

USER www

COPY build /usr/share/nginx/html
COPY config.nginx /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
