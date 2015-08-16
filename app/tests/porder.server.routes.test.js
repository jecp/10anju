'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Porder = mongoose.model('Porder'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, porder;

/**
 * Porder routes tests
 */
describe('Porder CRUD tests', function() {
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

		// Save a user to the test db and create new Porder
		user.save(function() {
			porder = {
				name: 'Porder Name'
			};

			done();
		});
	});

	it('should be able to save Porder instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Porder
				agent.post('/porders')
					.send(porder)
					.expect(200)
					.end(function(porderSaveErr, porderSaveRes) {
						// Handle Porder save error
						if (porderSaveErr) done(porderSaveErr);

						// Get a list of Porders
						agent.get('/porders')
							.end(function(pordersGetErr, pordersGetRes) {
								// Handle Porder save error
								if (pordersGetErr) done(pordersGetErr);

								// Get Porders list
								var porders = pordersGetRes.body;

								// Set assertions
								(porders[0].user._id).should.equal(userId);
								(porders[0].name).should.match('Porder Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Porder instance if not logged in', function(done) {
		agent.post('/porders')
			.send(porder)
			.expect(401)
			.end(function(porderSaveErr, porderSaveRes) {
				// Call the assertion callback
				done(porderSaveErr);
			});
	});

	it('should not be able to save Porder instance if no name is provided', function(done) {
		// Invalidate name field
		porder.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Porder
				agent.post('/porders')
					.send(porder)
					.expect(400)
					.end(function(porderSaveErr, porderSaveRes) {
						// Set message assertion
						(porderSaveRes.body.message).should.match('Please fill Porder name');
						
						// Handle Porder save error
						done(porderSaveErr);
					});
			});
	});

	it('should be able to update Porder instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Porder
				agent.post('/porders')
					.send(porder)
					.expect(200)
					.end(function(porderSaveErr, porderSaveRes) {
						// Handle Porder save error
						if (porderSaveErr) done(porderSaveErr);

						// Update Porder name
						porder.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Porder
						agent.put('/porders/' + porderSaveRes.body._id)
							.send(porder)
							.expect(200)
							.end(function(porderUpdateErr, porderUpdateRes) {
								// Handle Porder update error
								if (porderUpdateErr) done(porderUpdateErr);

								// Set assertions
								(porderUpdateRes.body._id).should.equal(porderSaveRes.body._id);
								(porderUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Porders if not signed in', function(done) {
		// Create new Porder model instance
		var porderObj = new Porder(porder);

		// Save the Porder
		porderObj.save(function() {
			// Request Porders
			request(app).get('/porders')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Porder if not signed in', function(done) {
		// Create new Porder model instance
		var porderObj = new Porder(porder);

		// Save the Porder
		porderObj.save(function() {
			request(app).get('/porders/' + porderObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', porder.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Porder instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Porder
				agent.post('/porders')
					.send(porder)
					.expect(200)
					.end(function(porderSaveErr, porderSaveRes) {
						// Handle Porder save error
						if (porderSaveErr) done(porderSaveErr);

						// Delete existing Porder
						agent.delete('/porders/' + porderSaveRes.body._id)
							.send(porder)
							.expect(200)
							.end(function(porderDeleteErr, porderDeleteRes) {
								// Handle Porder error error
								if (porderDeleteErr) done(porderDeleteErr);

								// Set assertions
								(porderDeleteRes.body._id).should.equal(porderSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Porder instance if not signed in', function(done) {
		// Set Porder user 
		porder.user = user;

		// Create new Porder model instance
		var porderObj = new Porder(porder);

		// Save the Porder
		porderObj.save(function() {
			// Try deleting Porder
			request(app).delete('/porders/' + porderObj._id)
			.expect(401)
			.end(function(porderDeleteErr, porderDeleteRes) {
				// Set message assertion
				(porderDeleteRes.body.message).should.match('User is not logged in');

				// Handle Porder error error
				done(porderDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Porder.remove().exec();
		done();
	});
});