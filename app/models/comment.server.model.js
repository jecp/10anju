'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Comment Schema
 */
var CommentSchema = new Schema({
	name: {
		type: String,
		trim: true
	},
	title: {
		type: String,
	},
	content: {
		type: String,
		required: 'Please fill content',
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
	ccenter: [{
		type: Schema.ObjectId,
		ref: 'Ccenter'
	}],
	article: [{
		type: Schema.ObjectId,
		ref: 'Article'
	}],
	good: [{
		type: Schema.ObjectId,
		ref: 'Good'
	}],
	forum: [{
		type: Schema.ObjectId,
		ref: 'Forum'
	}],
	subject:{
		type: Schema.ObjectId,
		ref: 'Subject'
	},
	pv:{
		type:Number,
		default:0
	},
	like:{
		type:Number,
		default:0
	},
	collect:{
		type:Schema.ObjectId,
		ref:'Collection'
	}
});

mongoose.model('Comment', CommentSchema);
