FROM nginx:stable-alpine
COPY build /usr/share/nginx/html
COPY config.nginx /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
