'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var messages = require('../../app/controllers/messages.server.controller');

	// Messages Routes
	app.route('/messages')
		.get(users.requiresLogin, messages.list)
		.post(users.requiresLogin, messages.create);

	app.route('/messages/:messageId')
		.get(messages.read)
		// .put(users.requiresLogin, messages.hasAuthorization, messages.update)
		.delete(users.requiresLogin, messages.hasAuthorization, messages.delete);

	app.route('/messages/admin/list')
		.get(users.requiresLogin, users.adminRequired, messages.list)
		.post(users.requiresLogin, users.adminRequired, messages.modify);

	// Finish by binding the Message middleware
	app.param('messageId', messages.messageByID);
};
