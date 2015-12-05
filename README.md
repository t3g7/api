# API [![Docker Hub](https://img.shields.io/badge/docker-ready-blue.svg)](https://registry.hub.docker.com/u/t3g7/api/)

## Requirements

- Cassandra

## Use the API

Run the API with `docker run -d -p 8080:8080 t3g7/api $CASSANDRA_IP`

The API will be available at `http://$DOCKER_HOST_IP:8080` and its documentation at `http://$DOCKER_HOST_IP:8080/docs`

The documentation can be edited with Swagger: `swagger project edit`

## Without Docker

Install dependencies with `npm install`

Run the API with `node server.js -c/--cassandraip $CASSANDRA_CLUSTER_IP`

The api will be available at `http://localhost:8080`

## Tests

Make sure the docker image is running, set `DOCKER_HOST_IP` and `CASSANDRA_IP` as environment variables then run `npm test`
