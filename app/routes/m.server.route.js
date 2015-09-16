'use strict';

module.exports = function(app) {
	// Root routing
	var m = require('../../app/controllers/m.server.controller'),
		visithistory = require('../../app/controllers/visithistorys.server.controller');
	app.route('/m').get(visithistory.vh_log, m.index);
};
