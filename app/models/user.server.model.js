'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	firstName: {
		type: String,
		trim: true,
		default: '',
		//validate: [validateLocalStrategyProperty, 'Please fill in your first name']
	},
	lastName: {
		type: String,
		trim: true,
		default: '',
		//validate: [validateLocalStrategyProperty, 'Please fill in your last name']
	},
	displayName: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, '请填写常用邮箱'],
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	username: {
		type: String,
		unique: 'testing error message',
		validate: [validateLocalStrategyProperty, '用户名已存在'],
		required: '用户名不能为空',
		trim: true
	},
	password: {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, '密码长度不够']
	},
	salt: {
		type: String
	},
	mobile: {
		type: Number,
		unique: '',
		validate: [validateLocalStrategyProperty, '手机号已被注册存在'],
		required: '手机号不能为空',
		trim: true
	},
	provider: {
		type: String,
		required: 'Provider is required'
	},
	providerData: {},
	additionalProvidersData: {},
	roles: {
		type: [{
			type: String,
			enum: ['user', 'admin']
		}],
		default: ['user']
	},
	updated: {
		type: Date,
		default: Date.now
	},
	created: {
		type: Date,
		default: Date.now
	},
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	},
	/* add */
	agreement:{
		type: Boolean,
		validate: [validateLocalStrategyProperty, '请确保同意用户协议'],
		default: false
	},
	ccenter:{
		type:Schema.ObjectId,
		ref:'Ccenter'
	},
	roomNum: {
		type: Number,
	},
	avatar:{
		type:String
	},
	followers:[{
		type:Schema.ObjectId,
		ref:'User'
	}],
	following:[{
		type:Schema.ObjectId,
		ref:'User'
	}],
	goods_like:[{
		type:Schema.ObjectId,
			ref:'Good'
	}],
	articles_like:[{
		type:Schema.ObjectId,
			ref:'Article'
	}]
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {	
	if (this.password && this.password.length > 6) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}
	if (this.isNew) {
		this.create = this.update = Date.now;
	  	var md5 = crypto.randomBytes(16),
	  		email_MD5 = crypto.randomBytes(16).toString('hex');
	  		// email_MD5 = md5.update(this.email.toLowerCase()).digest('hex'),
	  		this.avatar = 'http://gravatar.com/avatar/' + email_MD5 + '?s=256';
	}
	else {
	  this.update = Date.now;
	}

	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

mongoose.model('User', UserSchema);
