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
	updated:{
		type:Date,
		default: Date.now
	},
	pay_time:{
		type:Date,
		default: Date.now
	},
	detail:[{
		goods: {type:Schema.ObjectId,
			ref:'Good'},
		amount:{type:Number,default:1},
		price:{type:Number}
	}],
	cart:{
		type:Schema.ObjectId,
		ref:'Cart'
	},
	total:{
		type: Number,
		default: 0
	},
	total_amount:{
		type:Number
	},
	checkout:{
		type: Boolean,
		default: false
	},
	pay_method:{
		type: String,
		default: 'alipay'
	},
	status: {
		type:Boolean,
		default: false
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	bz: {
		type:String,
		default:''
	},
	trade_no: {
		type:String
	},
	pos_no:{
		type:String
	}
});

mongoose.model('Order', OrderSchema);
