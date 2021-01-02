FROM biocorecrg/perlbrew-nginx-fcgi
COPY ./cgi-bin /cgi-bin
COPY build /usr/share/nginx/html
COPY config.nginx /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
