'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Ccenter = mongoose.model('Ccenter'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, ccenter;

/**
 * Ccenter routes tests
 */
describe('Ccenter CRUD tests', function() {
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

		// Save a user to the test db and create new Ccenter
		user.save(function() {
			ccenter = {
				name: 'Ccenter Name'
			};

			done();
		});
	});

	it('should be able to save Ccenter instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ccenter
				agent.post('/ccenters')
					.send(ccenter)
					.expect(200)
					.end(function(ccenterSaveErr, ccenterSaveRes) {
						// Handle Ccenter save error
						if (ccenterSaveErr) done(ccenterSaveErr);

						// Get a list of Ccenters
						agent.get('/ccenters')
							.end(function(ccentersGetErr, ccentersGetRes) {
								// Handle Ccenter save error
								if (ccentersGetErr) done(ccentersGetErr);

								// Get Ccenters list
								var ccenters = ccentersGetRes.body;

								// Set assertions
								(ccenters[0].user._id).should.equal(userId);
								(ccenters[0].name).should.match('Ccenter Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Ccenter instance if not logged in', function(done) {
		agent.post('/ccenters')
			.send(ccenter)
			.expect(401)
			.end(function(ccenterSaveErr, ccenterSaveRes) {
				// Call the assertion callback
				done(ccenterSaveErr);
			});
	});

	it('should not be able to save Ccenter instance if no name is provided', function(done) {
		// Invalidate name field
		ccenter.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ccenter
				agent.post('/ccenters')
					.send(ccenter)
					.expect(400)
					.end(function(ccenterSaveErr, ccenterSaveRes) {
						// Set message assertion
						(ccenterSaveRes.body.message).should.match('Please fill Ccenter name');
						
						// Handle Ccenter save error
						done(ccenterSaveErr);
					});
			});
	});

	it('should be able to update Ccenter instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ccenter
				agent.post('/ccenters')
					.send(ccenter)
					.expect(200)
					.end(function(ccenterSaveErr, ccenterSaveRes) {
						// Handle Ccenter save error
						if (ccenterSaveErr) done(ccenterSaveErr);

						// Update Ccenter name
						ccenter.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Ccenter
						agent.put('/ccenters/' + ccenterSaveRes.body._id)
							.send(ccenter)
							.expect(200)
							.end(function(ccenterUpdateErr, ccenterUpdateRes) {
								// Handle Ccenter update error
								if (ccenterUpdateErr) done(ccenterUpdateErr);

								// Set assertions
								(ccenterUpdateRes.body._id).should.equal(ccenterSaveRes.body._id);
								(ccenterUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Ccenters if not signed in', function(done) {
		// Create new Ccenter model instance
		var ccenterObj = new Ccenter(ccenter);

		// Save the Ccenter
		ccenterObj.save(function() {
			// Request Ccenters
			request(app).get('/ccenters')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Ccenter if not signed in', function(done) {
		// Create new Ccenter model instance
		var ccenterObj = new Ccenter(ccenter);

		// Save the Ccenter
		ccenterObj.save(function() {
			request(app).get('/ccenters/' + ccenterObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', ccenter.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Ccenter instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ccenter
				agent.post('/ccenters')
					.send(ccenter)
					.expect(200)
					.end(function(ccenterSaveErr, ccenterSaveRes) {
						// Handle Ccenter save error
						if (ccenterSaveErr) done(ccenterSaveErr);

						// Delete existing Ccenter
						agent.delete('/ccenters/' + ccenterSaveRes.body._id)
							.send(ccenter)
							.expect(200)
							.end(function(ccenterDeleteErr, ccenterDeleteRes) {
								// Handle Ccenter error error
								if (ccenterDeleteErr) done(ccenterDeleteErr);

								// Set assertions
								(ccenterDeleteRes.body._id).should.equal(ccenterSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Ccenter instance if not signed in', function(done) {
		// Set Ccenter user 
		ccenter.user = user;

		// Create new Ccenter model instance
		var ccenterObj = new Ccenter(ccenter);

		// Save the Ccenter
		ccenterObj.save(function() {
			// Try deleting Ccenter
			request(app).delete('/ccenters/' + ccenterObj._id)
			.expect(401)
			.end(function(ccenterDeleteErr, ccenterDeleteRes) {
				// Set message assertion
				(ccenterDeleteRes.body.message).should.match('User is not logged in');

				// Handle Ccenter error error
				done(ccenterDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Ccenter.remove().exec();
		done();
	});
});