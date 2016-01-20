#!/bin/sh

echo "This script is to be used with Docker v1.9.1 or greater."
echo "You have" $(docker -v)

sudo -v

export TEST_DIR=$(realpath .)

# before install
docker pull cassandra:2.2.4
docker network create testnw
docker run -d --net testnw --name db cassandra:2.2.4
docker run -it --rm --net testnw -v $TEST_DIR:/test cassandra:2.2.4 cqlsh db -f /test/init.cql

# install
docker build -t t3g7/api .
npm install -g swagger

# before script
docker run -d --name api --net testnw -p 8080:8080 t3g7/api db

if [[ "$OSTYPE" == "linux-gnu" ]]; then
	export API_SERVER_IP="$(docker inspect --format='{{ .NetworkSettings.Networks.testnw.IPAddress }}' api)"
else
	export API_SERVER_IP="$(docker-machine ip $DOCKER_MACHINE_NAME)"
fi

# script
npm test
