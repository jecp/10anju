'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Ccenter Schema
 */
var CcenterSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Ccenter name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: [{
			type: Schema.ObjectId,
			ref: 'User'
		}],
	province:{type:String},
	city:{type:String},
	district:{type:String},
	street:{type:String},
	detail:{type:String},
	lng:{type:String},
	lat:{type:String},
	pv:{type:Number,default:0},
	meta: {
	  createAt: {
	    type: Date,
	    default: Date.now()
	  },
	  updateAt: {
	    type: Date,
	    default: Date.now()
	  }
	}
});

mongoose.model('Ccenter', CcenterSchema);
