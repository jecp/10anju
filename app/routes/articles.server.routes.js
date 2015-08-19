'use strict';

/**
 * Module dependencies.
 */

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller'),
		articles = require('../../app/controllers/articles.server.controller');

	// Article Routes
	app.route('/articles')
		.get(articles.list)
		.post(users.requiresLogin, articles.create);

	app.route('/articles/:articleId')
		.get(articles.read)
		.put(users.requiresLogin, articles.hasAuthorization, articles.update)
		.delete(users.requiresLogin, articles.hasAuthorization, articles.delete);

	app.route('/articles/admin/list')
		.get(users.requiresLogin, users.adminRequired, articles.list)
		.post(users.requiresLogin, users.adminRequired, articles.modify);

	app.route('/articles/fulledit')
		.post(users.requiresLogin, articles.fulledit);

	// Finish by binding the article middleware
	app.param('articleId', articles.articleByID);
};
