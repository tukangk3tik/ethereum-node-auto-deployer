#!/bin/bash

# ./stop-node.sh ip_address ubuntu ~/.ssh/id_rsa geth

if [ "$#" -ne 4 ]; then
    echo "Usage: $0 <node_ip> <user> <private_key_file> <node_type>"
    exit 1
fi

EXTRA_VARS="GETH_CONTAINER_NAME=geth-node-1"
ansible-playbook -i "$1," --user $2 --private-key $3 --extra-vars "$EXTRA_VARS" _infra/ansible/playbook-$4-stop.yml