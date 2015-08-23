'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Subject Schema
 */
var SubjectSchema = new Schema({
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
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	subcat: {
		type: String
	},
	title: {
		type: String,
		required: 'Please fill Subject title',
	},
	keyword: [{
		type: String
	}],
	tags:[{
		type:String
	}],
	content: {
		type: String
	},
	markdown:{
		type:String
	},
	status:{
		type: Boolean
	},
	forum:{
		type:Schema.ObjectId,
		ref: 'Forum'
	},
	comment: [{
		type:Schema.ObjectId,
		ref: 'Comment'
	}],
	pv:{
		type:Number,
		default:0
	},
	like:{
		type:Number,
		default:0
	},
	collect:{
		type:Number,
		default:0
	}
});

mongoose.model('Subject', SubjectSchema);
