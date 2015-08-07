'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Collect = mongoose.model('Collect'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, collect;

/**
 * Collect routes tests
 */
describe('Collect CRUD tests', function() {
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

		// Save a user to the test db and create new Collect
		user.save(function() {
			collect = {
				name: 'Collect Name'
			};

			done();
		});
	});

	it('should be able to save Collect instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Collect
				agent.post('/collects')
					.send(collect)
					.expect(200)
					.end(function(collectSaveErr, collectSaveRes) {
						// Handle Collect save error
						if (collectSaveErr) done(collectSaveErr);

						// Get a list of Collects
						agent.get('/collects')
							.end(function(collectsGetErr, collectsGetRes) {
								// Handle Collect save error
								if (collectsGetErr) done(collectsGetErr);

								// Get Collects list
								var collects = collectsGetRes.body;

								// Set assertions
								(collects[0].user._id).should.equal(userId);
								(collects[0].name).should.match('Collect Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Collect instance if not logged in', function(done) {
		agent.post('/collects')
			.send(collect)
			.expect(401)
			.end(function(collectSaveErr, collectSaveRes) {
				// Call the assertion callback
				done(collectSaveErr);
			});
	});

	it('should not be able to save Collect instance if no name is provided', function(done) {
		// Invalidate name field
		collect.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Collect
				agent.post('/collects')
					.send(collect)
					.expect(400)
					.end(function(collectSaveErr, collectSaveRes) {
						// Set message assertion
						(collectSaveRes.body.message).should.match('Please fill Collect name');
						
						// Handle Collect save error
						done(collectSaveErr);
					});
			});
	});

	it('should be able to update Collect instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Collect
				agent.post('/collects')
					.send(collect)
					.expect(200)
					.end(function(collectSaveErr, collectSaveRes) {
						// Handle Collect save error
						if (collectSaveErr) done(collectSaveErr);

						// Update Collect name
						collect.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Collect
						agent.put('/collects/' + collectSaveRes.body._id)
							.send(collect)
							.expect(200)
							.end(function(collectUpdateErr, collectUpdateRes) {
								// Handle Collect update error
								if (collectUpdateErr) done(collectUpdateErr);

								// Set assertions
								(collectUpdateRes.body._id).should.equal(collectSaveRes.body._id);
								(collectUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Collects if not signed in', function(done) {
		// Create new Collect model instance
		var collectObj = new Collect(collect);

		// Save the Collect
		collectObj.save(function() {
			// Request Collects
			request(app).get('/collects')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Collect if not signed in', function(done) {
		// Create new Collect model instance
		var collectObj = new Collect(collect);

		// Save the Collect
		collectObj.save(function() {
			request(app).get('/collects/' + collectObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', collect.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Collect instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Collect
				agent.post('/collects')
					.send(collect)
					.expect(200)
					.end(function(collectSaveErr, collectSaveRes) {
						// Handle Collect save error
						if (collectSaveErr) done(collectSaveErr);

						// Delete existing Collect
						agent.delete('/collects/' + collectSaveRes.body._id)
							.send(collect)
							.expect(200)
							.end(function(collectDeleteErr, collectDeleteRes) {
								// Handle Collect error error
								if (collectDeleteErr) done(collectDeleteErr);

								// Set assertions
								(collectDeleteRes.body._id).should.equal(collectSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Collect instance if not signed in', function(done) {
		// Set Collect user 
		collect.user = user;

		// Create new Collect model instance
		var collectObj = new Collect(collect);

		// Save the Collect
		collectObj.save(function() {
			// Try deleting Collect
			request(app).delete('/collects/' + collectObj._id)
			.expect(401)
			.end(function(collectDeleteErr, collectDeleteRes) {
				// Set message assertion
				(collectDeleteRes.body.message).should.match('User is not logged in');

				// Handle Collect error error
				done(collectDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Collect.remove().exec();
		done();
	});
});