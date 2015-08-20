'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller'),
		visithistory = require('../../app/controllers/visithistorys.server.controller'),
		messages = require('../../app/controllers/messages.server.controller');

	// Messages Routes
	app.route('/messages')
		.get(users.requiresLogin, visithistory.vh_log, messages.list)
		.post(users.requiresLogin, visithistory.vh_log, messages.create);

	app.route('/messages/:messageId')
		.get(visithistory.vh_log, messages.read)
		// .put(users.requiresLogin, messages.hasAuthorization, messages.update)
		.delete(users.requiresLogin, visithistory.vh_log, messages.hasAuthorization, messages.delete);

	app.route('/messages/admin/list')
		.get(users.requiresLogin, visithistory.vh_log, users.adminRequired, messages.list)
		.post(users.requiresLogin, visithistory.vh_log, users.adminRequired, messages.modify);

	// Finish by binding the Message middleware
	app.param('messageId', messages.messageByID);
};
