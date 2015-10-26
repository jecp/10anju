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
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	},
	goods:[{
		name:{type:String},
		spec:{type:String},
		price:{type:String},
		amount:{type:String}
	}],
	total:{
		type:Number
	},
	bz:{
		type:String
	},
	status:{
		type:Boolean,
		default: false
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Porder', PorderSchema);
