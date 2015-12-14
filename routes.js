module.exports = function(app, client) {
  function executeQuery(request, res) {
    /*client.execute(request, function(err, result) {
      if (err) {
        res.status(404).send({message: err});
      } else {
        if (result.rows.length > 0) {
          res.send(result.rows);
        } else {
          console.log('No results');
        }
      }
    });*/

    client.stream(request)
        .on('readable', function() {
          var row;
          while (row = this.read()) {
            console.log('Data received: tweet text = %s', row.body);
          }
        })
        .on('end', function() {
          console.log('Stream ended');
        })
        .on('error', function() {
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

  app.get('/tweets/user/id/:id', function(req, res) {
    var userId = req.params.id;

    var getTweetsByUserId = 'SELECT * FROM twitter_streaming.tweets WHERE user_id=' + userId + 'ALLOW FILTERING;';
    executeQuery(getTweetsByUserId, res);
  });

  app.get('/tweets/user/name/:name', function(req, res) {
    var userName = req.params.name;

    var getTweetsByUserScreenName = "SELECT * FROM twitter_streaming.tweets WHERE user_screen_name='" + userName + "';";
    executeQuery(getTweetsByUserScreenName, res);
  });

  app.get('/tweet/:id', function(req, res) {
    var getTweetById = 'SELECT * FROM twitter_streaming.tweets WHERE tweet_id=' + req.params.id + ';';
    executeQuery(getTweetById, res);
  });

  app.get('/freq', function(req, res) {
    var getFreq = 'SELECT * FROM twitter_streaming.freq;';
    executeQuery(getFreq, res);
  });
}
