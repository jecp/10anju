'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var subjects = require('../../app/controllers/subjects.server.controller');

	// Subjects Routes
	app.route('/subjects/userCount')
		.get(users.requiresLogin, subjects.userCount);

	app.route('/subjects')
		.get(subjects.list)
		.post(users.requiresLogin, subjects.create);

	app.route('/subjects/:subjectId')
		.get(subjects.read)
		.put(users.requiresLogin, subjects.hasAuthorization, subjects.update)
		.delete(users.requiresLogin, subjects.hasAuthorization, subjects.delete);

	app.route('/subjects_like')
		.post(users.requiresLogin, subjects.like);

	app.route('/subjects/fulledit')
		.post(users.requiresLogin, subjects.fulledit);

	app.route('/subjects/admin/list')
		.get(users.requiresLogin, users.adminRequired, subjects.list)
		.post(users.requiresLogin, users.adminRequired, subjects.modify);

	// Finish by binding the Subject middleware
	app.param('subjectId', subjects.subjectByID);
};
