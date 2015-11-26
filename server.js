var express = require('express');
var bodyParser = require('body-parser');
var cassandra = require('cassandra-driver');

var app = express();
app.use(bodyParser.json());

var client = new cassandra.Client({ contactPoints : ['127.0.0.1']});
client.connect(function(err, res) {
	console.log('Connected');
});

app.get('/', function(req, res) {
	var getTweets = 'SELECT * FROM twitter_streaming.tweets;';
	client.execute(getTweets, function(err, result) {
		if (err) {
			res.status(404).send({msg: 'Tweets not found'});
		} else {
			res.json(result);
		}
	});
});

app.listen(8080);
