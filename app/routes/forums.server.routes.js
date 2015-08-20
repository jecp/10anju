'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller'),
		visithistory = require('../../app/controllers/visithistorys.server.controller'),
		forums = require('../../app/controllers/forums.server.controller');

	// Forums Routes
	app.route('/forums')
		.get(visithistory.vh_log, forums.list)
		.post(users.requiresLogin, visithistory.vh_log, users.adminRequired, forums.create);

	app.route('/forums/:forumId')
		.get(visithistory.vh_log, forums.read)
		.put(users.requiresLogin, visithistory.vh_log, forums.hasAuthorization, users.adminRequired, forums.update)
		.delete(users.requiresLogin, visithistory.vh_log, forums.hasAuthorization, users.adminRequired, forums.delete);

	app.route('/forums/admin/list')
		.get(users.requiresLogin, visithistory.vh_log, users.adminRequired, forums.list)
		.post(users.requiresLogin, visithistory.vh_log, users.adminRequired, forums.modify);

	// Finish by binding the Forum middleware
	app.param('forumId', forums.forumByID);
};
