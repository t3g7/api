module.exports = function(app, client, io) {
  function executeQuery(request, res) {

    var stream = client.stream(request);

    var result = [];
    stream.on('data', function(data) {
      result.push(data);
      console.log(data);
    });

    stream.on('end', function() {
      res.json(result);
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
};
