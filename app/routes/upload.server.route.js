'use strict';
var multipart = require('connect-multiparty'),
	multipartMiddleware = multipart();

module.exports = function(app) {
	// Root routing
	var upload = require('../../app/controllers/upload.server.controller'),
		visithistory = require('../../app/controllers/visithistorys.server.controller');
	app.route('/core/upload').post(visithistory.vh_log,multipartMiddleware,upload.saveFile);
};
