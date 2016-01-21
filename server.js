'use strict';

var SwaggerExpress = require('swagger-express-mw');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');
var bodyParser = require('body-parser');
var cassandra = require('cassandra-driver');
var stdio = require('stdio');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var sleep = require('sleep');

module.exports = app; // for testing
app.use(bodyParser.json());

var config = {
  appRoot: __dirname // required config
};

var ops = stdio.getopt({
    'cassandraip': {key: 'c', args: 1, description: 'Cassandra contact point IP'}
});
var cassandraContacPoint = ops.cassandraip || process.env.CASSANDRA_IP;

if (!ops.cassandraip && !process.env.CASSANDRA_IP) {
  ops.printHelp();
  process.exit();
}

var client = new cassandra.Client({ contactPoints : [cassandraContacPoint]});
require('./routes')(app, client, io);

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // add swagger-ui
  app.use(SwaggerUi(swaggerExpress.runner.swagger));

  // install middleware
  swaggerExpress.register(app);

  app.use(function(req, res, next) {
    //res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  function streamResult(query, namespace) {
    var stream = client.stream(query);
    var result = [];
    stream.on('data', function(data) {
      result.push(data);
    });
    stream.on('end', function() {
      io.emit(namespace, result);
      console.log('Stream ' + namespace + ' ended at ' + new Date());
    });
  }

  io.on('connection', function(socket) {
    var tweets = 'SELECT * FROM twitter_streaming.tweets;';
    streamResult(tweets, 'tweets');

    var freq = 'SELECT * FROM twitter_streaming.freq;';
    streamResult(freq, 'freq');

    var trends = 'SELECT * FROM twitter_streaming.trends;';
    streamResult(trends, 'trends');

    socket.on('tweets-next', function() {
      sleep.sleep(5);
      streamResult(tweets, 'tweets');
    });

    socket.on('freq-next', function() {
      sleep.sleep(2);
      streamResult(freq, 'freq');
    });

    socket.on('trends-next', function() {
      sleep.sleep(2);
      streamResult(trends, 'trends');
    });
  });

  var port = process.env.PORT || 8080;
  server.listen(port);
});
