# This file is a template, and might need editing before it works on your project.
FROM httpd:alpine

COPY ./www /usr/local/apache2/htdocs/
