FROM nginx

COPY ./bin/startup.sh ./bin/startup.sh

COPY build /usr/share/nginx/html
COPY config.nginx /etc/nginx/nginx.conf

EXPOSE 80

ENTRYPOINT ["./bin/startup.sh", "/usr/share/nginx/html/.oauth"]
CMD ["nginx", "-g", "daemon off;"]
