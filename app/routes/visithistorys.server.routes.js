'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var visithistorys = require('../../app/controllers/visithistorys.server.controller');

	// Visithistorys Routes
	app.route('/visithistorys')
		.get(visithistorys.list)
		.post(users.requiresLogin, visithistorys.create);

	app.route('/visithistorys/:visithistoryId')
		.get(visithistorys.read)
		.put(users.requiresLogin, visithistorys.hasAuthorization, visithistorys.update)
		.delete(users.requiresLogin, visithistorys.hasAuthorization, visithistorys.delete);

	// Finish by binding the Visithistory middleware
	app.param('visithistoryId', visithistorys.visithistoryByID);
};
