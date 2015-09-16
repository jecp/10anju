'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
 	Visithistory = mongoose.model('Visithistory'),
 	qiniu = require('qiniu');

/**
 * Save file 
 */
function uploadFile(localFile, key, uptoken) {
	var extra = new qiniu.io.PutExtra();

	qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
	    if(!err) {
	    	console.log(key, ret.hash);
	    } else {
	    	console.log(err);
	    }
	});
};

function uptoken(bucketname) {
  var putPolicy = new qiniu.rs.PutPolicy(bucketname);
  return putPolicy.token();
}

exports.saveFile = function (req,res){
	var att = req.files.img.name.split('.')[1];
	var uploadToken = uptoken('havemay');
	uploadFile(req.files.img.path,req.files.img.name,uploadToken);
	res.send('http://img.havemay.cn/pic_'+att+'/'+req.files.img.name);
};
