'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var collects = require('../../app/controllers/collects.server.controller');

	// Collects Routes
	app.route('/collects')
		.get(collects.list)
		.post(users.requiresLogin, collects.create);

	app.route('/collects/:collectId')
		.get(collects.read)
		.put(users.requiresLogin, collects.hasAuthorization, collects.update)
		.delete(users.requiresLogin, collects.hasAuthorization, collects.delete);

	app.route('/mycollect')
		.post(collects.mycollect);
		
	// Finish by binding the Collect middleware
	app.param('collectId', collects.collectByID);
};
