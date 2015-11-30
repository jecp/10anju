'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

/**
 * Category Schema
 */
var CategorySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Category name',
		trim: true
	},
	img: {
		type:String
	},
	subcat: [{
		type:String,
		unique: '子分类不可重复',
	}],
	created: {
		type: Date,
		default: Date.now
	},
	updated:{
		type:Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	goods:[{
		type: ObjectId,ref: 'Good'
	}],
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
		ref:'Collect'
	}
});

// var ObjectId = mongoose.Schema.Types.ObjectId
CategorySchema.pre('save', function(next) {
  if (this.isNew) {
    this.created = this.updated = Date.now;
  }
  else {
    this.updated = Date.now;
  }

  next();
});

mongoose.model('Category', CategorySchema);
