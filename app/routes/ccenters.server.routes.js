'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller'),
		visithistory = require('../../app/controllers/visithistorys.server.controller'),
		ccenters = require('../../app/controllers/ccenters.server.controller');

	// Ccenters Routes
	app.route('/ccenters/count')
		.get(visithistory.vh_log, ccenters.count);

	app.route('/ccenters')
		.get(visithistory.vh_log, ccenters.list)
		.post(users.requiresLogin, visithistory.vh_log, users.adminRequired, ccenters.create);

	app.route('/ccenters/:ccenterId')
		.get(visithistory.vh_log, ccenters.read)
		.put(users.requiresLogin, visithistory.vh_log, users.adminRequired, users.adminRequired, ccenters.update)
		.delete(users.requiresLogin, visithistory.vh_log, ccenters.hasAuthorization, users.adminRequired, ccenters.delete);

	app.route('/ccenters_register')
		.put(users.requiresLogin, visithistory.vh_log, ccenters.update);

	app.route('/my_ccenter')
		.post(users.requiresLogin, visithistory.vh_log, ccenters.findU);

	app.route('/ccenters/admin/list')
		.get(users.requiresLogin, visithistory.vh_log, users.adminRequired, ccenters.list)
		.post(users.requiresLogin, visithistory.vh_log, users.adminRequired, ccenters.modify);

	// Finish by binding the Ccenter middleware
	app.param('ccenterId', ccenters.ccenterByID);
};
