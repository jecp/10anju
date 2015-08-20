'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller'),
		visithistory = require('../../app/controllers/visithistorys.server.controller'),
		porders = require('../../app/controllers/porders.server.controller');

	// Porders Routes
	app.route('/porders')
		.get(visithistory.vh_log, porders.list)
		.post(users.requiresLogin, visithistory.vh_log, porders.create);

	app.route('/porders/:porderId')
		.get(visithistory.vh_log, porders.read)
		.put(users.requiresLogin, visithistory.vh_log, porders.hasAuthorization, porders.update)
		.delete(users.requiresLogin, visithistory.vh_log, porders.hasAuthorization, porders.delete);

	app.route('/porders/admin/list')
		.get(users.requiresLogin, visithistory.vh_log, users.adminRequired, porders.list)
		.post(users.requiresLogin, visithistory.vh_log, users.adminRequired, porders.modify);

	// Finish by binding the Porder middleware
	app.param('porderId', porders.porderByID);
};
