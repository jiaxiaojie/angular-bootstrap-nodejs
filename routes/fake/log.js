var express = require('express');
var router = express.Router();
var _ = require('lodash');
var fs = require('fs');
/**
 * @fakedoc 日志记录
 *
 * @name log
 * @href /log
 * @input.post {string} s 日志信息
 * @input.post {string} level  0:debug ,1:info ,2:warn，3：error
 * @output {json} 记录是否成功
 * {
 *  code:"{int}    状态代码（0表示成功，其它值表示失败）",
 *  text:"{String} 状态描述"
 * }
 * 
 * @description
 *
 * 手机号码如果是 13577778888 表示已经注册过，否则都表示未注册过
 *
 * https://localhost:3000/log?client=asdfaqerq1werqwe&mobile=13577778888
 * 
 * https://fakeapi.fdjf.net:3000/log?client=asdfaqerq1werqwe&mobile=13577778888
 */
router.all('/log', function (req, res) {

	var str = req.query.s || req.body.s ;
	var level  = req.query.level || 1;
	var code = -1;
	var text = '无效参数';
	if(str){
		code =0;
		text = str;
	}
    var resultValue = {
    	code: code,
    	text: text
    };
    res.json(resultValue);


	/*
	  写入log信息
	 */
	var filePath = 'E:/fs/'
	var filename = 'info.txt';
	var b = false;
	if(!fs.existsSync(filePath)){
		fs.mkdirSync(filePath);
	}

	function format(date,fmt) { //author: meizz
		var o = {
			"M+": date.getMonth() + 1, //月份
			"d+": date.getDate(), //日
			"h+": date.getHours(), //小时
			"m+": date.getMinutes(), //分
			"s+": date.getSeconds(), //秒
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度
			"S": date.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}
	console.log(format(new Date(),'yyyy-MM-dd HH:mm:ss')+ ';' +text);
	fs.appendFileSync(filePath+filename,format(new Date(),'yyyy-MM-dd hh:mm:ss')+ ';' +text+'\r\n');
});

router.all('/log2', function (req, res) {

	var str = req.query.s || req.body.s ;
	var level  = req.query.level || 1;
	var code = -1;
	var text = '无效参数';
	if(str){
		code =0;
		text = str;
	}
	var resultValue = {
		code: code,
		text: text
	};
	res.json(resultValue);


	/*
	 写入log信息
	 */
	var filePath = __dirname+'/../../reports/';
	var filename = 'info.txt';
	var b = false;
	if(!fs.existsSync(filePath)){
		fs.mkdirSync(filePath);
	}

	function format(date,fmt) { //author: meizz
		var o = {
			"M+": date.getMonth() + 1, //月份
			"d+": date.getDate(), //日
			"h+": date.getHours(), //小时
			"m+": date.getMinutes(), //分
			"s+": date.getSeconds(), //秒
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度
			"S": date.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}

	var str = new Date().toLocaleString() + "\t" + req.ip + "\t" + text.replace("\n", "\t").replace("\r", "\t");
	//console.log(str);
	fs.appendFileSync(filePath+filename,str+"\n");
});

module.exports = router;