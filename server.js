'use strict';

var SwaggerExpress = require('swagger-express-mw');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');
var bodyParser = require('body-parser');
var cassandra = require('cassandra-driver');
var stdio = require('stdio');
var app = require('express')();

module.exports = app; // for testing
app.use(bodyParser.json());

var config = {
  appRoot: __dirname // required config
};

var ops = stdio.getopt({
    'cassandraip': {key: 'c', args: 1, mandatory: true, description: 'Cassandra contact point IP'}
});
var cassandraContacPoint = ops.cassandraip;

if (!cassandraContacPoint) {
  ops.printHelp();
}

var client = new cassandra.Client({ contactPoints : [cassandraContacPoint]});
var routes = require('./routes')(app, client);

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // add swagger-ui
  app.use(SwaggerUi(swaggerExpress.runner.swagger));

  // install middleware
  swaggerExpress.register(app);

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  var port = process.env.PORT || 8080;
  app.listen(port);
});
