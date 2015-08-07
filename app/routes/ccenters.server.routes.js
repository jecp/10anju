'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var ccenters = require('../../app/controllers/ccenters.server.controller');

	// Ccenters Routes
	app.route('/ccenters')
		.get(ccenters.list)
		.post(users.requiresLogin,users.adminRequired, ccenters.create);

	app.route('/ccenters/:ccenterId')
		.get(ccenters.read)
		.put(users.requiresLogin, users.adminRequired, users.adminRequired, ccenters.update)
		.delete(users.requiresLogin, ccenters.hasAuthorization, users.adminRequired, ccenters.delete);

	app.route('/ccenters_register')
		.put(users.requiresLogin, ccenters.update);

	app.route('/my_ccenter')
		.post(users.requiresLogin, ccenters.findU);

	// Finish by binding the Ccenter middleware
	app.param('ccenterId', ccenters.ccenterByID);
};
