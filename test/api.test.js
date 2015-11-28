var server = require('../server.js');
var supertest = require('supertest');

var api = supertest.agent('http://localhost:8080');

describe('Test API', function() {
	describe('/GET tweets', function() {
		it('return all tweets', function(done) {
			api.get('/tweets')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});
	});
});
