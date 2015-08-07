'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Forum = mongoose.model('Forum'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, forum;

/**
 * Forum routes tests
 */
describe('Forum CRUD tests', function() {
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

		// Save a user to the test db and create new Forum
		user.save(function() {
			forum = {
				name: 'Forum Name'
			};

			done();
		});
	});

	it('should be able to save Forum instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Forum
				agent.post('/forums')
					.send(forum)
					.expect(200)
					.end(function(forumSaveErr, forumSaveRes) {
						// Handle Forum save error
						if (forumSaveErr) done(forumSaveErr);

						// Get a list of Forums
						agent.get('/forums')
							.end(function(forumsGetErr, forumsGetRes) {
								// Handle Forum save error
								if (forumsGetErr) done(forumsGetErr);

								// Get Forums list
								var forums = forumsGetRes.body;

								// Set assertions
								(forums[0].user._id).should.equal(userId);
								(forums[0].name).should.match('Forum Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Forum instance if not logged in', function(done) {
		agent.post('/forums')
			.send(forum)
			.expect(401)
			.end(function(forumSaveErr, forumSaveRes) {
				// Call the assertion callback
				done(forumSaveErr);
			});
	});

	it('should not be able to save Forum instance if no name is provided', function(done) {
		// Invalidate name field
		forum.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Forum
				agent.post('/forums')
					.send(forum)
					.expect(400)
					.end(function(forumSaveErr, forumSaveRes) {
						// Set message assertion
						(forumSaveRes.body.message).should.match('Please fill Forum name');
						
						// Handle Forum save error
						done(forumSaveErr);
					});
			});
	});

	it('should be able to update Forum instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Forum
				agent.post('/forums')
					.send(forum)
					.expect(200)
					.end(function(forumSaveErr, forumSaveRes) {
						// Handle Forum save error
						if (forumSaveErr) done(forumSaveErr);

						// Update Forum name
						forum.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Forum
						agent.put('/forums/' + forumSaveRes.body._id)
							.send(forum)
							.expect(200)
							.end(function(forumUpdateErr, forumUpdateRes) {
								// Handle Forum update error
								if (forumUpdateErr) done(forumUpdateErr);

								// Set assertions
								(forumUpdateRes.body._id).should.equal(forumSaveRes.body._id);
								(forumUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Forums if not signed in', function(done) {
		// Create new Forum model instance
		var forumObj = new Forum(forum);

		// Save the Forum
		forumObj.save(function() {
			// Request Forums
			request(app).get('/forums')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Forum if not signed in', function(done) {
		// Create new Forum model instance
		var forumObj = new Forum(forum);

		// Save the Forum
		forumObj.save(function() {
			request(app).get('/forums/' + forumObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', forum.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Forum instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Forum
				agent.post('/forums')
					.send(forum)
					.expect(200)
					.end(function(forumSaveErr, forumSaveRes) {
						// Handle Forum save error
						if (forumSaveErr) done(forumSaveErr);

						// Delete existing Forum
						agent.delete('/forums/' + forumSaveRes.body._id)
							.send(forum)
							.expect(200)
							.end(function(forumDeleteErr, forumDeleteRes) {
								// Handle Forum error error
								if (forumDeleteErr) done(forumDeleteErr);

								// Set assertions
								(forumDeleteRes.body._id).should.equal(forumSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Forum instance if not signed in', function(done) {
		// Set Forum user 
		forum.user = user;

		// Create new Forum model instance
		var forumObj = new Forum(forum);

		// Save the Forum
		forumObj.save(function() {
			// Try deleting Forum
			request(app).delete('/forums/' + forumObj._id)
			.expect(401)
			.end(function(forumDeleteErr, forumDeleteRes) {
				// Set message assertion
				(forumDeleteRes.body.message).should.match('User is not logged in');

				// Handle Forum error error
				done(forumDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Forum.remove().exec();
		done();
	});
});