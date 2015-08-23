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
	content: {
		type: String,
		required: 'Please fill content',
	},
	markdown:{
		type:String
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
	user_to:{
		type: Schema.ObjectId,
		ref: 'User'
	},
	ccenter: {
		type: Schema.ObjectId,
		ref: 'Ccenter'
	},
	articles: {
		type: Schema.ObjectId,
		ref: 'Article'
	},
	goods: {
		type: Schema.ObjectId,
		ref: 'Good'
	},
	forum: {
		type: Schema.ObjectId,
		ref: 'Forum'
	},
	subjects:{
		type: Schema.ObjectId,
		ref: 'Subject'
	},
	comment_from:{
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
