#!/bin/sh

echo "{\"id\":\"$client_id\"}" > /usr/share/nginx/html/.oauth.json
echo "Printed to system."