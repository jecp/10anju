'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var admins = require('../../app/controllers/admins.server.controller');

	// Admins Routes
	app.route('/admins')
		.get(admins.list)
		.post(users.requiresLogin, admins.create);

	app.route('/admins?isArray')
		.post(admins.login);

	app.route('/admins/:adminId')
		.get(admins.read)
		.put(users.requiresLogin, admins.hasAuthorization, admins.update)
		.delete(users.requiresLogin, admins.hasAuthorization, admins.delete);

	app.route('/admins/admin/list')
		.get(users.requiresLogin, users.adminRequired, admins.list)
		.post(users.requiresLogin, users.adminRequired, admins.modify);

	// Finish by binding the Admin middleware
	app.param('adminId', admins.adminByID);
};
