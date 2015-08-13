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
	name: {
		type: String,
		default: '',
		required: 'Please fill Visithistory name',
		trim: true
	},
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
	curl: [{
		url:{
			type:String
		},created:{
			type:Date,
			default:Date.now
		},updated:{
			type:Date,
			default:Date.now
		}
	}],
	lurl:{
		type:String
	},
	turl:{
		type:String
	},
	customIp: {
		type:String
	},
	customOs: {
		type:String
	},
	customBower:{
		type:String
	},
	customArea: {
		type:String
	}
});

mongoose.model('Visithistory', VisithistorySchema);
