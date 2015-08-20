'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {

	//console.log(req);
	console.log(req.connection.remoteAddress);
	var ip = req.headers['x-forwarded-for'] || 
		req.connection.remoteAddress || 
	    req.socket.remoteAddress ||
	    req.connection.socket.remoteAddress;
	console.log(ip);

	res.render('index', {
		user: req.user || null,
		request: req
	});
};

/**
 * Module dependencies.
 */
exports.member_rights = function(req, res) {
	res.render('static/member-rights', {
		user: req.user || null,
		request: req
	});
};

/**
 * Module dependencies.
 */
exports.about = function(req, res) {
	res.render('static/css3', {
		user: req.user || null,
		request: req
	});
};

