'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller'),
		visithistory = require('../../app/controllers/visithistorys.server.controller'),
		subjects = require('../../app/controllers/subjects.server.controller');

	// Subjects Routes
	app.route('/subjects/userCount')
		.get(users.requiresLogin, visithistory.vh_log, subjects.userCount);

	app.route('/subjects/count')
		.get(visithistory.vh_log, subjects.count);

	app.route('/subjects')
		.get(visithistory.vh_log, subjects.list)
		.post(users.requiresLogin, visithistory.vh_log, subjects.create);

	app.route('/subjects/:subjectId')
		.get(visithistory.vh_log, subjects.read)
		.put(users.requiresLogin, visithistory.vh_log, subjects.hasAuthorization, subjects.update)
		.delete(users.requiresLogin, visithistory.vh_log, subjects.hasAuthorization, subjects.delete);

	app.route('/subjects_like')
		.post(users.requiresLogin, visithistory.vh_log, subjects.like);

	app.route('/subjects/fulledit')
		.post(users.requiresLogin, visithistory.vh_log, subjects.fulledit);

	app.route('/subjects/admin/list')
		.get(users.requiresLogin, visithistory.vh_log, users.adminRequired, subjects.list)
		.post(users.requiresLogin, visithistory.vh_log, users.adminRequired, subjects.modify);

	// Finish by binding the Subject middleware
	app.param('subjectId', subjects.subjectByID);
};
