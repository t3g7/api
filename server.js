'use strict';

var SwaggerExpress = require('swagger-express-mw');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');
var bodyParser = require('body-parser');
var cassandra = require('cassandra-driver');
var stdio = require('stdio');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

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
//require('./routes')(app, client, io);

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

  function executeQuery(request, res) {
    var stream = client.stream(request);

    var result = [];
    stream.on('data', function(data) {
      result.push(data);
    });

    stream.on('end', function() {
      res.json(result);
      io.emit('tweets', result);
      console.log('Stream ended');
    });

    stream.on('error', function() {
      console.log('Error');
    });
  }

  app.get('/', function(req, res) {
    res.send({msg: 'Spark Streaming app API. Please go to /docs for documentation'})
  });

  app.get('/tweets', function(req, res) {
    var sentiment = req.query.sentiment;

    if (sentiment !== undefined) {
      var getTweetsBySentiment = "SELECT * FROM twitter_streaming.tweets WHERE sentiment='" + sentiment + "';";
      executeQuery(getTweetsBySentiment, res);
    } else {
      var getAllTweets = 'SELECT * FROM twitter_streaming.tweets;';
      executeQuery(getAllTweets, res);
    }
  });

  var port = process.env.PORT || 8080;
  server.listen(port);
});
