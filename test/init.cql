CREATE KEYSPACE IF NOT EXISTS twitter_streaming_test WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 1};

CREATE TABLE IF NOT EXISTS twitter_streaming_test.tweets (
  body text,
  user_id bigint,
  user_screen_name text,
  lang text,
  created_at timestamp,
  favorite_count int,
  retweet_count int,
  tweet_id bigint,
  user_mentions list<text>,
  hashtags list<text>,
  urls list<text>,
  sentiment text,
  PRIMARY KEY (body, user_id, tweet_id, user_screen_name, sentiment)
);

CREATE INDEX ON twitter_streaming_test.tweets(sentiment);
CREATE INDEX ON twitter_streaming_test.tweets(user_id);
CREATE INDEX ON twitter_streaming_test.tweets(user_screen_name);
CREATE INDEX ON twitter_streaming_test.tweets(tweet_id);

CREATE TABLE IF NOT EXISTS twitter_streaming_test.freq (
  date timestamp,
  count int,
  PRIMARY KEY (date)
);

INSERT INTO twitter_streaming_test.tweets (body, user_id, user_screen_name, lang, created_at, favorite_count, retweet_count, tweet_id, user_mentions, hashtags, urls, sentiment) VALUES ('This is a test', 202103663, 'Orange_conseil', 'fr', '2015-11-22T13:33:48.000Z', 0, 0, 671388154356723712, [''], [''], [''], 'POSITIVE');

INSERT INTO twitter_streaming_test.freq (date, count) VALUES ('2015-11-22T13:33:48.000Z', 12);
