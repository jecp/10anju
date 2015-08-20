'use strict';

/**
 * Module dependencies.
 */

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller'),
		visithistory = require('../../app/controllers/visithistorys.server.controller'),
		articles = require('../../app/controllers/articles.server.controller');

	// Article Routes
	app.route('/articles')
		.get(visithistory.vh_log, articles.list)
		.post(users.requiresLogin, visithistory.vh_log, articles.create);

	app.route('/articles/:articleId')
		.get(visithistory.vh_log, articles.read)
		.put(users.requiresLogin, visithistory.vh_log, articles.hasAuthorization, articles.update)
		.delete(users.requiresLogin, visithistory.vh_log, articles.hasAuthorization, articles.delete);

	app.route('/articles/admin/list')
		.get(users.requiresLogin, visithistory.vh_log, users.adminRequired, articles.list)
		.post(users.requiresLogin, visithistory.vh_log, users.adminRequired, articles.modify);

	app.route('/articles/fulledit')
		.post(users.requiresLogin, visithistory.vh_log, articles.fulledit);

	// Finish by binding the article middleware
	app.param('articleId', articles.articleByID);
};
