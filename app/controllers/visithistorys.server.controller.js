'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Visithistory = mongoose.model('Visithistory'),
	_ = require('lodash'),
	request = require('request');

/**
 * Create a Visithistory
 */
exports.create = function(req, res) {
	var visithistory = new Visithistory(req.body);
	visithistory.user = req.user;

	visithistory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(visithistory);
		}
	});
};

/**
 * Show the current Visithistory
 */
exports.read = function(req, res) {
	res.jsonp(req.visithistory);
};

/**
 * Update a Visithistory
 */
exports.update = function(req, res) {
	var visithistory = req.visithistory ;

	visithistory = _.extend(visithistory , req.body);

	visithistory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(visithistory);
		}
	});
};

/**
 * Delete an Visithistory
 */
exports.delete = function(req, res) {
	var visithistory = req.visithistory ;

	visithistory.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(visithistory);
		}
	});
};

/**
 * List of Visithistorys
 */
exports.list = function(req, res) {
	Visithistory.find().sort('-created').limit(100).populate('user', 'userame avatar').exec(function(err, visithistorys) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(visithistorys);
		}
	});
};

/**
 * Count of Visithistorys
 */
exports.count = function(req, res) {
	Visithistory.count().exec(function(err, visithistorys) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(visithistorys);
		}
	});
};

/**
 * Modify a Visithistory
 */
exports.modify = function(req, res) {
	var visithistoryObj = req.body;
	Visithistory.findOneAndUpdate({_id:visithistoryObj._id},{subcat:visithistoryObj.subcat,name:visithistoryObj.name,title:visithistoryObj.title,price:visithistoryObj.price},function (err,visithistory) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(visithistory);
		}
	});
};

/**
 * Visithistory middleware
 */
exports.visithistoryByID = function(req, res, next, id) { 
	Visithistory.findById(id).populate('user', 'displayName').exec(function(err, visithistory) {
		if (err) return next(err);
		if (! visithistory) return next(new Error('Failed to load Visithistory ' + id));
		req.visithistory = visithistory ;
		next();
	});
};

/**
 * Visithistory authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.visithistory.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

/**
 * Visithistory for bigdata middleware
 */
exports.vh_log = function(req, res, next) { 

	var logObj = new Visithistory(req.headers),
		areaObj;
	
	logObj.user = (req.user!=='undefined') ? req.user : '';
	logObj.sessionID = req.sessionID;
	logObj.originalUrl = req.originalUrl;
	logObj.method = req.method;
	logObj.res_locals_url = req.res.locals.url;
	logObj.https = req.headers.https;
	var ip = (req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : undefined) || 
		req.connection.remoteAddress || 
	    req.socket.remoteAddress ||
	    req.connection.socket.remoteAddress;
	logObj.remoteAddress = ip;

	logObj.user_agent = req.headers['user-agent'];
	logObj.customOs = req.headers['user-agent'].split(') ')[0]+')';
	logObj.customBrowser = (req.headers['user-agent'].split(') ').length > 1) ? req.headers['user-agent'].split(') ')[1]+')' : req.headers['user-agent'].split(';')[1];
	logObj.customLanguage = req.headers['accept-language'];

	request({url:'http://ip.taobao.com/service/getIpInfo.php?ip='+ip,gzip:true},function (err,res,body){
		if (err){console.log(err);}
		else if(body){
			if(_.startsWith(body,'<')) {
				return false;
			}
			else{
				areaObj = JSON.parse(body);
				if (areaObj.code === 1){return false;}

				if (req.user && req.user !== undefined){
					Visithistory.findOne({user:req.user._id,originalUrl:req.originalUrl},function (err,visithistory,next){
						if (err) {console.log(err);} 
						else if (visithistory){
							return false;
						}else{
							logObj.customCountry = areaObj.data.country;
							logObj.customCountry_id = areaObj.data.country_id;
							logObj.customArea = areaObj.data.area;
							logObj.customArea_id = areaObj.data.area_id;
							logObj.customRegion = areaObj.data.region;
							logObj.customRegion_id = areaObj.data.region_id;
							logObj.customCity = areaObj.data.city;
							logObj.customCity_id = areaObj.data.city_id;
							logObj.customIsp = areaObj.data.isp;
							logObj.customIsp_id = areaObj.data.isp_id;

							logObj.save(function (err,visithistory) {
								if (err) {console.log(err);}
							});	
						}
					});
				} else{
					Visithistory.findOne({sessionID:req.sessionID,originalUrl:req.originalUrl},function (err,visithistory,next){
						if (err) {console.log(err);} 
						else if (visithistory){
							return false;
						} 
						else{
							logObj.customCountry = areaObj.data.country;
							logObj.customCountry_id = areaObj.data.country_id;
							logObj.customArea = areaObj.data.area;
							logObj.customArea_id = areaObj.data.area_id;
							logObj.customRegion = areaObj.data.region;
							logObj.customRegion_id = areaObj.data.region_id;
							logObj.customCity = areaObj.data.city;
							logObj.customCity_id = areaObj.data.city_id;
							logObj.customIsp = areaObj.data.isp;
							logObj.customIsp_id = areaObj.data.isp_id;

							logObj.save(function (err,visithistory) {
								if (err) {console.log(err);}
							});	
						}
					});
				}
			}
		} 
	});

	next();
};
