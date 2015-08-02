'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Cart Schema
 */
var CartSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Cart name',
		trim: true
	},
	number: {
		type: Number,
		required: 'Please check the cart',
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
	day: {type:String},
	detail: [{
		goods: {type:Schema.ObjectId,
			ref:'Good'},
		price: {type:Number},
		amount:{type:Number,default: 1}
	}],		
	total:{
		type:Number,
	},
	order_status: {
		type: Boolean,
		default: false
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

// var ObjectId = mongoose.Schema.Types.ObjectId
CartSchema.pre('save', function(next) {
  if (this.isNew) {
    this.create = this.update = Date.now;
  }
  else {
    this.update = Date.now;
  }
  next();
});

mongoose.model('Cart', CartSchema);
