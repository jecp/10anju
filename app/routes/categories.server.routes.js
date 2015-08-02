'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var categories = require('../../app/controllers/categories.server.controller');

	// Categories Routes
	app.route('/categories')
		.get(categories.list)
		.post(users.requiresLogin, users.adminRequired, categories.create);

	app.route('/categories/:categoryId')
		.get(categories.read)
		.put(users.requiresLogin, categories.hasAuthorization, users.adminRequired, categories.update)
		.delete(users.requiresLogin, categories.hasAuthorization, users.adminRequired, categories.delete);

	// Finish by binding the Category middleware
	app.param('categoryId', categories.categoryByID);
};
