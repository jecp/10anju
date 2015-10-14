'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * QS Schema
 */
var QsSchema = new Schema({
	code:{type:Number},
	manuName:{type:String},
	tel:{type:Number},
	fax:{type:Number}
});


mongoose.model('Qs', QsSchema);
