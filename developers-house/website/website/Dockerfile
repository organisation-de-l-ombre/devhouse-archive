FROM nginx
RUN apt update
RUN apt install fcgiwrap -y

COPY ./cgi-bin /cgi-bin
COPY build /usr/share/nginx/html
COPY config.nginx /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
