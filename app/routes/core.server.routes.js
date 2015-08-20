'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller'),
		visithistory = require('../../app/controllers/visithistorys.server.controller');
	app.route('/').get(visithistory.vh_log, core.index);
	app.route('/member-rights').get(visithistory.vh_log, core.member_rights);
	app.route('/about').get(visithistory.vh_log, core.about);
};
