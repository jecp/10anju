'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller'),
		visithistory = require('../../app/controllers/visithistorys.server.controller'),
		likes = require('../../app/controllers/likes.server.controller');

	// Likes Routes
	app.route('/likes')
		.get(visithistory.vh_log,likes.list)
		.post(users.requiresLogin, visithistory.vh_log, likes.create);

	app.route('/likes/:likeId')
		.get(visithistory.vh_log, likes.read)
		.put(users.requiresLogin, visithistory.vh_log, likes.hasAuthorization, likes.update)
		.delete(users.requiresLogin, visithistory.vh_log, likes.hasAuthorization, likes.delete);

	// Finish by binding the Like middleware
	app.param('likeId', likes.likeByID);
};
