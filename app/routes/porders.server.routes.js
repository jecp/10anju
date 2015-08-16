'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var porders = require('../../app/controllers/porders.server.controller');

	// Porders Routes
	app.route('/porders')
		.get(porders.list)
		.post(users.requiresLogin, porders.create);

	app.route('/porders/:porderId')
		.get(porders.read)
		.put(users.requiresLogin, porders.hasAuthorization, porders.update)
		.delete(users.requiresLogin, porders.hasAuthorization, porders.delete);

	// Finish by binding the Porder middleware
	app.param('porderId', porders.porderByID);
};