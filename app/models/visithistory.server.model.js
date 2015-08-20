'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Visithistory Schema
 */
var VisithistorySchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	updated:{
		type:Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	sessionID:{
		type:String
	},
	originalUrl: {
		type:String
	},
	method:{
		type:String
	},
	res_locals_url:{
		type:String
	},
	https:{
		type:String
	},
	remoteAddress: {
		type:String
	},
	user_agent: {
		type:String
	},
	customOs: {
		type:String
	},
	customBrowser:{
		type:String
	},
	customCountry: {
		type:String
	},
	customCountry_id: {
		type:String
	},
	customArea: {
		type:String
	},
	customArea_id: {
		type:String
	},
	customRegion: {
		type:String
	},
	customRegion_id: {
		type:String
	},
	customCity: {
		type:String
	},
	customCity_id: {
		type:String
	},
	customLanguage: {
		type:String
	},
	customIsp: {
		type:String
	},
	customIsp_id: {
		type:String
	},
	readtime:{
		type:Number
	}
});

mongoose.model('Visithistory', VisithistorySchema);
