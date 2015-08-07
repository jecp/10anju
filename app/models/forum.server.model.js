'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Forum Schema
 */
var ForumSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Forum name',
		trim: true
	},
	created: {
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
		type: String
	},
	keyword: [{
		type: String
	}],
	ccenter: [{
		type: Schema.ObjectId,
		ref: 'Ccenter'
	}],
	subject: [{
		type: Schema.ObjectId,
		ref: 'Subject'
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
	collect:{
		type:Schema.ObjectId,
		ref:'Collection'
	}
});

mongoose.model('Forum', ForumSchema);
