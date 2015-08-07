'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Collect Schema
 */
var CollectSchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	},
	ccenter: [{
		type: Schema.ObjectId,
		ref: 'Ccenter'
	}],
	subject: [{
		type: Schema.ObjectId,
		ref: 'Subject'
	}],
	article: [{
		type: Schema.ObjectId,
		ref: 'Article'
	}],
	good: [{
		type: Schema.ObjectId,
		ref: 'Good'
	}],
	content: {
		type: String
	},
	pv:{
		type:Number,
		default:0
	},
	like:{
		type:Number,
		default:0
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Collect', CollectSchema);
