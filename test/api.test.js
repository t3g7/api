var supertest = require('supertest');
var cassandra = require('cassandra-driver');

var api = supertest.agent('http://'+ process.env.DOCKER_HOST_IP +':8080');

describe('Test API', function() {
	describe('/GET home', function() {
		it('return the homepage', function(done) {
			api.get('/')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});
	});

	/*describe('/GET docs', function() {
		it('return the API documentation', function(done) {
			api.get('/docs/')
				.set('Accept', 'text/html')
				.expect('Content-Type', 'text/html; charset=UTF-8')
				.expect(200, done);
		});
	});*/

	/*describe('/GET tweets', function() {
		it('return all tweets', function(done) {
			api.get('/tweets')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});
	});*/

	describe('/GET tweets by sentiment', function() {
		it('return tweets filtered by sentiment', function(done) {
			api.get('/tweets?sentiment=POSITIVE')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});
	});

	describe('/GET tweets by user id', function() {
		it('return tweets of user based on its id', function(done) {
			api.get('/tweets/user/id/202103663')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});
	});

	describe('/GET tweets by user name', function() {
		it('return tweets of user based on its screen name', function(done) {
			api.get('/tweets/user/name/Orange_conseil')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});
	});

	describe('/GET tweet by id', function() {
		it('return tweet based on its id', function(done) {
			api.get('/tweet/671388154356723712')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});
	});

	describe('/GET freq', function() {
		it('return tweet count by minute', function(done) {
			api.get('/freq')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});
	});
});
