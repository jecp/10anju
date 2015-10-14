'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * GDS (goods code) Schema
 */
var GdsSchema = new Schema({
	code:{
		type:Number
	},
	goodsName:{
		type:String
	},
	titleSrc:{
		type:String
	},
	guobie:{
		type:String
	},
	supplier:{
		type:String
	},
	sort_id:{
		type:Number
	},
	faccode:{
		type:Number
	},
	facName:{
		type:String
	},
	fac_status:{
		type:String
	},
	manuName:{
		type:String
	},
	spec:{
		type:String
	},
	price:{
		type:Number
	},
	trademark:{
		type:String
	},
	img:{
		type:String
	},
	ret_code:{
		type:String
	},
	QS:{
		type:Schema.ObjectId,ref:'Qs'
	},
	manuAdd:{
		type:String
	},
	manuPhone:{
		type:Number
	},
	manuWeb:{
		type:String
	},
	manuFax:{
		type:Number
	},
	manu400:{
		type:Number
	},
	createDate:{
		type:Date
	},
	storageTime:{
		type:Number
	},
	peiliao:{
		type:String
	},
	created:{
		type:Date
	},
	updated:{
		type:Date
	}
});

GdsSchema.pre('save', function(next) {
	if (this.isNew) {
		this.created = this.updated = Date.now;
	}
	else {
	  this.updated = Date.now;
	}
	next();
});

mongoose.model('Gds', GdsSchema);
