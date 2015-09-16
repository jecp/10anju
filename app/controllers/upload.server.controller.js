'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
 	Visithistory = mongoose.model('Visithistory'),
 	qiniu = require('qiniu');

var ACCESS_KEY = '0rt9hdCjFHSrix70dahquToz_sRvkryXYuaoTytN';
var SECRET_KEY = 'W8azbHlC_Ck_79lltXlH9UV47q19NiqPg5J88q8S';


/**
 * Save file 
 */

function uptoken(bucketname) {
	var putPolicy = new qiniu.rs.PutPolicy(bucketname);
	var flags = putPolicy.getFlags();
	var encodedFlags = qiniu.util.urlsafeBase64Encode(JSON.stringify(flags));
	var encoded = qiniu.util.hmacSha1(encodedFlags, SECRET_KEY);
	var encodedSign = qiniu.util.base64ToUrlSafe(encoded);
	var uploadToken = ACCESS_KEY + ':' + encodedSign + ':' + encodedFlags;
	return uploadToken;
}

exports.saveFile = function (req,res){
	var uploadToken = uptoken('havemay');
	var key = Date.now()+req.files.img.name;

	var extra = new qiniu.io.PutExtra();
	qiniu.io.putFile(uploadToken, key, req.files.img.path, extra, function(err, ret) {
	    if(err) {
	    	console.log(err,ret);
	    	res.send('Something goes wrong,please retry!');
	    }
	    else{
	    	res.send('http://img.havemay.cn/'+key);
	    }
	});	
};
