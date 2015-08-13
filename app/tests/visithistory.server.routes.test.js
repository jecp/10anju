'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Visithistory = mongoose.model('Visithistory'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, visithistory;

/**
 * Visithistory routes tests
 */
describe('Visithistory CRUD tests', function() {
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

		// Save a user to the test db and create new Visithistory
		user.save(function() {
			visithistory = {
				name: 'Visithistory Name'
			};

			done();
		});
	});

	it('should be able to save Visithistory instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Visithistory
				agent.post('/visithistorys')
					.send(visithistory)
					.expect(200)
					.end(function(visithistorySaveErr, visithistorySaveRes) {
						// Handle Visithistory save error
						if (visithistorySaveErr) done(visithistorySaveErr);

						// Get a list of Visithistorys
						agent.get('/visithistorys')
							.end(function(visithistorysGetErr, visithistorysGetRes) {
								// Handle Visithistory save error
								if (visithistorysGetErr) done(visithistorysGetErr);

								// Get Visithistorys list
								var visithistorys = visithistorysGetRes.body;

								// Set assertions
								(visithistorys[0].user._id).should.equal(userId);
								(visithistorys[0].name).should.match('Visithistory Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Visithistory instance if not logged in', function(done) {
		agent.post('/visithistorys')
			.send(visithistory)
			.expect(401)
			.end(function(visithistorySaveErr, visithistorySaveRes) {
				// Call the assertion callback
				done(visithistorySaveErr);
			});
	});

	it('should not be able to save Visithistory instance if no name is provided', function(done) {
		// Invalidate name field
		visithistory.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Visithistory
				agent.post('/visithistorys')
					.send(visithistory)
					.expect(400)
					.end(function(visithistorySaveErr, visithistorySaveRes) {
						// Set message assertion
						(visithistorySaveRes.body.message).should.match('Please fill Visithistory name');
						
						// Handle Visithistory save error
						done(visithistorySaveErr);
					});
			});
	});

	it('should be able to update Visithistory instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Visithistory
				agent.post('/visithistorys')
					.send(visithistory)
					.expect(200)
					.end(function(visithistorySaveErr, visithistorySaveRes) {
						// Handle Visithistory save error
						if (visithistorySaveErr) done(visithistorySaveErr);

						// Update Visithistory name
						visithistory.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Visithistory
						agent.put('/visithistorys/' + visithistorySaveRes.body._id)
							.send(visithistory)
							.expect(200)
							.end(function(visithistoryUpdateErr, visithistoryUpdateRes) {
								// Handle Visithistory update error
								if (visithistoryUpdateErr) done(visithistoryUpdateErr);

								// Set assertions
								(visithistoryUpdateRes.body._id).should.equal(visithistorySaveRes.body._id);
								(visithistoryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Visithistorys if not signed in', function(done) {
		// Create new Visithistory model instance
		var visithistoryObj = new Visithistory(visithistory);

		// Save the Visithistory
		visithistoryObj.save(function() {
			// Request Visithistorys
			request(app).get('/visithistorys')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Visithistory if not signed in', function(done) {
		// Create new Visithistory model instance
		var visithistoryObj = new Visithistory(visithistory);

		// Save the Visithistory
		visithistoryObj.save(function() {
			request(app).get('/visithistorys/' + visithistoryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', visithistory.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Visithistory instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Visithistory
				agent.post('/visithistorys')
					.send(visithistory)
					.expect(200)
					.end(function(visithistorySaveErr, visithistorySaveRes) {
						// Handle Visithistory save error
						if (visithistorySaveErr) done(visithistorySaveErr);

						// Delete existing Visithistory
						agent.delete('/visithistorys/' + visithistorySaveRes.body._id)
							.send(visithistory)
							.expect(200)
							.end(function(visithistoryDeleteErr, visithistoryDeleteRes) {
								// Handle Visithistory error error
								if (visithistoryDeleteErr) done(visithistoryDeleteErr);

								// Set assertions
								(visithistoryDeleteRes.body._id).should.equal(visithistorySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Visithistory instance if not signed in', function(done) {
		// Set Visithistory user 
		visithistory.user = user;

		// Create new Visithistory model instance
		var visithistoryObj = new Visithistory(visithistory);

		// Save the Visithistory
		visithistoryObj.save(function() {
			// Try deleting Visithistory
			request(app).delete('/visithistorys/' + visithistoryObj._id)
			.expect(401)
			.end(function(visithistoryDeleteErr, visithistoryDeleteRes) {
				// Set message assertion
				(visithistoryDeleteRes.body.message).should.match('User is not logged in');

				// Handle Visithistory error error
				done(visithistoryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Visithistory.remove().exec();
		done();
	});
});