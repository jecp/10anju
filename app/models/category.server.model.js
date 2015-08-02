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
	goods:[{type: ObjectId,ref: 'Good'}]
});

// var ObjectId = mongoose.Schema.Types.ObjectId
CategorySchema.pre('save', function(next) {
  if (this.isNew) {
    this.create = this.update = Date.now;
  }
  else {
    this.update = Date.now;
  }

  next();
});

mongoose.model('Category', CategorySchema);
