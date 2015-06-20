'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Order Schema
 */
var OrderSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Order name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	goods: [],
	total:{
		type: Number,
		default: 0
	},
	checkout:{
		type: Boolean,
		default: false
	},
	pay_method:{
		type: [{
			type: String,
			enum: ['check', 'wechat', 'alipay', 'pos']
		}],
		default: ['alipay']
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Order', OrderSchema);
