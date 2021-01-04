#!/bin/bash

if [[ -z $1 ]]; then
    echo 'ERROR: No target file given.'
    exit 1
fi

echo $client_id > $1

# Execute all other paramters
exec "${@:2}"
