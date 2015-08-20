'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller'),
		visithistory = require('../../app/controllers/visithistorys.server.controller'),
		collects = require('../../app/controllers/collects.server.controller');

	// Collects Routes
	app.route('/collects')
		.get(visithistory.vh_log, collects.list)
		.post(users.requiresLogin, visithistory.vh_log, collects.create);

	app.route('/collects/:collectId')
		.get(visithistory.vh_log, collects.read)
		.put(users.requiresLogin, visithistory.vh_log, collects.hasAuthorization, collects.update)
		.delete(users.requiresLogin, visithistory.vh_log, collects.hasAuthorization, collects.delete);

	app.route('/mycollect')
		.post(visithistory.vh_log, collects.mycollect);

	app.route('/collects/admin/list')
		.get(users.requiresLogin, visithistory.vh_log, users.adminRequired, collects.list)
		.post(users.requiresLogin, visithistory.vh_log, users.adminRequired, collects.modify);
		
	// Finish by binding the Collect middleware
	app.param('collectId', collects.collectByID);
};
