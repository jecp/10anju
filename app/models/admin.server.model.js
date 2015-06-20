'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Admin Schema
 */
var AdminSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Admin name',
		trim: true
	},
	level: {
		type: Number,
		default: 0
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Admin', AdminSchema);
