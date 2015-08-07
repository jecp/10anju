'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	subcat: {
		type: String
	},
	pv:{
		type:Number,
		default:0
	},
	like:{
		type:Number,
		default:0
	},
	collect:{
		type: Number,
		default: 0
	}
});

// var ObjectId = mongoose.Schema.Types.ObjectId
ArticleSchema.pre('save', function(next) {
  if (this.isNew) {
    this.create = this.update = Date.now;
  }
  else {
    this.update = Date.now;
  }

  next();
});

mongoose.model('Article', ArticleSchema);
