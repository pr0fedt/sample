#!/bin/bash
set -e

if [ -z "$DOCKER_HOST" ]; then
  DOCKER_IP=127.0.0.1
else
  DOCKER_IP=`echo $DOCKER_HOST | sed -n 's/tcp:\/\/\(.*\):.*$/\1/p'`
fi

docker rm -f $(docker ps -qa) || true

docker run -d -p 3001:3000 api:latest
docker run -d -p 3000:3000 --env REACT_APP_API_HOST=$DOCKER_IP:3001 client:latest

echo http://$DOCKER_IP:3000
