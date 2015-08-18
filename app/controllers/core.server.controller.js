'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
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

/**
 * Module dependencies.
 */
exports.textarea = function(req, res) {
	res.render('static/textarea', {
		user: req.user || null,
		request: req
	});
};
