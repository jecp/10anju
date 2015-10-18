'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller'),
		visithistory = require('../../app/controllers/visithistorys.server.controller'),
		admins = require('../../app/controllers/admins.server.controller');

	// Admins Routes
	app.route('/admins')
		.get(visithistory.vh_log,admins.list)
		.post(users.requiresLogin, visithistory.vh_log, admins.create);

	app.route('/admins_login')
		.post(visithistory.vh_log, admins.login);

	app.route('/admins/:adminId')
		.get(visithistory.vh_log, admins.read)
		.put(users.requiresLogin, visithistory.vh_log, admins.hasAuthorization, admins.update)
		.delete(users.requiresLogin, visithistory.vh_log, admins.hasAuthorization, admins.delete);

	app.route('/admins/admin/list')
		.get(users.requiresLogin, visithistory.vh_log, users.adminRequired, admins.list)
		.post(users.requiresLogin, visithistory.vh_log, users.adminRequired, admins.modify);

	app.route('/gds')
		.get(users.requiresLogin, visithistory.vh_log, users.adminRequired, admins.findGds)

	// Finish by binding the Admin middleware
	app.param('adminId', admins.adminByID);
};
