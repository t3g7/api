# API [![Build Status](https://travis-ci.org/t3g7/api.svg?branch=ci)](https://travis-ci.org/t3g7/api) [![Codacy Badge](https://api.codacy.com/project/badge/grade/75e484cf9b8b48a1a8d26f0149320418)](https://www.codacy.com/app/b-fovet/api) [![Docker Hub](https://img.shields.io/badge/docker-ready-blue.svg)](https://registry.hub.docker.com/u/t3g7/api/)

## Requirements

- Cassandra (v2.2.4)
- Docker (v1.9.1)

## Use the API

Run the API with `docker run -d -p 8080:8080 t3g7/api $CASSANDRA_IP [-c $OTHER_CASSANDRA_IP]`

The API will be available at `http://$API_SERVER_IP:8080` and its documentation at `http://$API_SERVER_IP:8080/docs`

The documentation can be edited with Swagger: `swagger project edit`

## Without Docker

Install dependencies with `npm install`

Run the API with `node server.js -c/--cassandraip $CASSANDRA_NODE_IP [-c $OTHER_CASSANDRA_NODE_IP]`

The api will be available at `http://localhost:8080`

## Tests

The API is tested on Travis CI (not with Docker, see below for using it).

#### With Docker

Tests using Docker must be run locally (see [Issue#4](https://github.com/t3g7/api/issues/4)).

Make sure you have Docker `v1.9.1` or greater and execute `test.sh` in `test`.
