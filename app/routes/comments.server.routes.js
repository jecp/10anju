'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller'),
		visithistory = require('../../app/controllers/visithistorys.server.controller'),
		comments = require('../../app/controllers/comments.server.controller');

	// Comments Routes
	app.route('/comments/userCount')
		.get(users.requiresLogin, visithistory.vh_log, comments.userCount);

	app.route('/comments/count')
		.get(visithistory.vh_log, comments.count);

	app.route('/comments')
		.get(comments.list)
		.post(users.requiresLogin, visithistory.vh_log, comments.create);

	app.route('/comments/:commentId')
		.get(comments.read)
		.put(users.requiresLogin, visithistory.vh_log, comments.hasAuthorization, comments.update)
		.delete(users.requiresLogin, visithistory.vh_log, comments.hasAuthorization, comments.delete);

	app.route('/comments/admin/list')
		.get(users.requiresLogin, visithistory.vh_log, users.adminRequired, comments.list)
		.post(users.requiresLogin, visithistory.vh_log, users.adminRequired, comments.modify);

	// Finish by binding the Comment middleware
	app.param('commentId', comments.commentByID);
};
