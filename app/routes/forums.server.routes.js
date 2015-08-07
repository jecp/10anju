'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var forums = require('../../app/controllers/forums.server.controller');

	// Forums Routes
	app.route('/forums')
		.get(forums.list)
		.post(users.requiresLogin, users.adminRequired, forums.create);

	app.route('/forums/:forumId')
		.get(forums.read)
		.put(users.requiresLogin, forums.hasAuthorization, users.adminRequired, forums.update)
		.delete(users.requiresLogin, forums.hasAuthorization, users.adminRequired, forums.delete);

	// Finish by binding the Forum middleware
	app.param('forumId', forums.forumByID);
};
