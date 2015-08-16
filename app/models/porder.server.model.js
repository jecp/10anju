'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Porder Schema
 */
var PorderSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Porder name',
		trim: true
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

mongoose.model('Porder', PorderSchema);