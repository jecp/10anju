'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Good = mongoose.model('Good'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, good;

/**
 * Good routes tests
 */
describe('Good CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Good
		user.save(function() {
			good = {
				name: 'Good Name'
			};

			done();
		});
	});

	it('should be able to save Good instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Good
				agent.post('/goods')
					.send(good)
					.expect(200)
					.end(function(goodSaveErr, goodSaveRes) {
						// Handle Good save error
						if (goodSaveErr) done(goodSaveErr);

						// Get a list of Goods
						agent.get('/goods')
							.end(function(goodsGetErr, goodsGetRes) {
								// Handle Good save error
								if (goodsGetErr) done(goodsGetErr);

								// Get Goods list
								var goods = goodsGetRes.body;

								// Set assertions
								(goods[0].user._id).should.equal(userId);
								(goods[0].name).should.match('Good Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Good instance if not logged in', function(done) {
		agent.post('/goods')
			.send(good)
			.expect(401)
			.end(function(goodSaveErr, goodSaveRes) {
				// Call the assertion callback
				done(goodSaveErr);
			});
	});

	it('should not be able to save Good instance if no name is provided', function(done) {
		// Invalidate name field
		good.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Good
				agent.post('/goods')
					.send(good)
					.expect(400)
					.end(function(goodSaveErr, goodSaveRes) {
						// Set message assertion
						(goodSaveRes.body.message).should.match('Please fill Good name');
						
						// Handle Good save error
						done(goodSaveErr);
					});
			});
	});

	it('should be able to update Good instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Good
				agent.post('/goods')
					.send(good)
					.expect(200)
					.end(function(goodSaveErr, goodSaveRes) {
						// Handle Good save error
						if (goodSaveErr) done(goodSaveErr);

						// Update Good name
						good.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Good
						agent.put('/goods/' + goodSaveRes.body._id)
							.send(good)
							.expect(200)
							.end(function(goodUpdateErr, goodUpdateRes) {
								// Handle Good update error
								if (goodUpdateErr) done(goodUpdateErr);

								// Set assertions
								(goodUpdateRes.body._id).should.equal(goodSaveRes.body._id);
								(goodUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Goods if not signed in', function(done) {
		// Create new Good model instance
		var goodObj = new Good(good);

		// Save the Good
		goodObj.save(function() {
			// Request Goods
			request(app).get('/goods')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Good if not signed in', function(done) {
		// Create new Good model instance
		var goodObj = new Good(good);

		// Save the Good
		goodObj.save(function() {
			request(app).get('/goods/' + goodObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', good.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Good instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Good
				agent.post('/goods')
					.send(good)
					.expect(200)
					.end(function(goodSaveErr, goodSaveRes) {
						// Handle Good save error
						if (goodSaveErr) done(goodSaveErr);

						// Delete existing Good
						agent.delete('/goods/' + goodSaveRes.body._id)
							.send(good)
							.expect(200)
							.end(function(goodDeleteErr, goodDeleteRes) {
								// Handle Good error error
								if (goodDeleteErr) done(goodDeleteErr);

								// Set assertions
								(goodDeleteRes.body._id).should.equal(goodSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Good instance if not signed in', function(done) {
		// Set Good user 
		good.user = user;

		// Create new Good model instance
		var goodObj = new Good(good);

		// Save the Good
		goodObj.save(function() {
			// Try deleting Good
			request(app).delete('/goods/' + goodObj._id)
			.expect(401)
			.end(function(goodDeleteErr, goodDeleteRes) {
				// Set message assertion
				(goodDeleteRes.body.message).should.match('User is not logged in');

				// Handle Good error error
				done(goodDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Good.remove().exec();
		done();
	});
});