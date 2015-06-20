'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Good Schema
 */
var GoodSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: '请填写商品名称/Please fill Good name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	category:{type:Schema.ObjectId,ref:'Category'},
	subcat:{type:String,default:'',trim: true},
	article:[{type:Schema.ObjectId,ref:'Article'}],
	title:{
		type:String,
		default: '',
		required: '请填写商品标题/Please fill Good title',
		trim: true
	},
	summary:{
		type:String,
		default: '',
		required: '请填写商品简介/Please fill Good summary',
		trim: true
	},
	spec:{
		type:String,
		default: '',
		required: '请填写商品规格',///Please fill Good spec
		trim: true
	},
	price:{
		type:Number,
		default: '',
		required: '请填写商品价格/Please fill Good price',
		trim: true
	},
	sale:{
		type:Number,
		default: '',
		//required: '请填写商品促销价/Please fill Good sale',
		trim: true
	},
	weight:{
		type:Number,
		default: '',
		//required: '请填写商品净重/Please fill Good weight',
		trim: true
	},
	origin:{
		type:String,
		default: '',
		required: '请填写商品产地/Please fill Good origin',
		trim: true
	},
	delivery:{
		type:String,
		default: '',
		required: '请填写商品配送方式/Please fill Good delivery',
		trim: true
	},
	detail:{
		type:String,
		default: '',
		required: '请填写商品详情/Please fill Good detail',
		trim: true
	},
	main_img:{
		type:String,
		default: '',
		required: '请输入至少一个商品主图/Please fill Good main_img',
		trim: true
	},
	img:[{type:String}],
	stock:{
		type:Number,
		default: '',
		required: '请填写商品库存/Please fill Good stock',
		trim: true
	},
	wiki:{
		type:String,
		default: '',
		required: '请填写商品百科/Please fill Good wiki',
		trim: true
	},
	suitable:[{
			type:String,
			default: '',
			required: '请填写商品适宜人群/Please fill Good suitable',
			trim: true
	}],
	feature:[{
			type:String,
			default: '',
			required: '请填写商品功效/Please fill Good feature',
			trim: true
		}],
	nutrition:{
		type:String,
		default: '',
		required: '请填写商品营养价值/Please fill Good nutrition',
		trim: true
	},
	therapy:[{
		type: String,
		default:'',
		required: '请填写商品适宜疾病/Please fill Good therapy'
	}],
	avoid:{
		type:String,
		default:'',
		required:'请填写商品禁忌/Please fill Good avoid',
		trim: true
	},
	storage_method: {
		type: String,
		default: '',
		trim: true
	},
	recipes:{
		type:String,
		default: '',
		required: '请填写商品食用方法/Please fill Good recipes',
		trim: true
	},
	collocation:[{
		type:String,
		default: '',
		required: '请填写商品健康搭配/Please fill Good collocation',
		trim: true
	}],
	for_free:{
		type:Boolean,
		default: false
	},
	free_try:{
		type:Boolean,
		default: false
	},
	sold:{
		type:Number,
		default:0
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
		type:Schema.ObjectId,
		ref:'Collection'
	}
});

// var ObjectId = mongoose.Schema.Types.ObjectId
GoodSchema.pre('save', function(next) {
  if (this.isNew) {
    this.create = this.update = Date.now;
  }
  else {
    this.update = Date.now;
  }

  next();
});

mongoose.model('Good', GoodSchema);
