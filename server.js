'use strict';

var SwaggerExpress = require('swagger-express-mw');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');
var bodyParser = require('body-parser');
var cassandra = require('cassandra-driver');
var app = require('express')();

module.exports = app; // for testing
app.use(bodyParser.json());

var config = {
  appRoot: __dirname // required config
};

var client = new cassandra.Client({ contactPoints : ['127.0.0.1']});
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
