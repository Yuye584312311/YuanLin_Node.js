var http = require('http');
var url = require('url');//解析GET请求
var util = require('util');
var express=require('express');
var app=express();
var querystring =require('querystring')//解析POST请求
var utils=require('./utils.js');
var user=require('./user.js');
var goods=require('./good.js');
var index=require('./index.js');
var userAction=require('./userAction.js');

//util.inspect：讲任意字符串转换为对象
//util.inherits(constructor, superConstructor)是一个实现对象间原型继承 的函数。讲两个对象原型继承


//设置跨域访问
app.all('*',function(req,res,next){
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
   res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
   res.header("X-Powered-By",' 3.2.1');
   res.header("Content-Type", "application/json;charset=utf-8");
   next();
});

//配置服务端口
var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
 	console.log('app liste http://%s:%s', host, port);
});


//===========================================用户注册、登录=================================================

//需要传入token、openid、login_type、usericon、nickname、sex(可选)

//第三方用户注册/登录 GET
app.get('/api/user/otherReg',function(req,res){
	console.log('GET-->otherReg');
	var params=url.parse(req.url,true).query;
	if(null!=params){
		console.log('GET-->otherReg-->params：',params);
		user.otherRegister(params,function(disData){
			res.status(200),
			res.json(disData);
		});
	}else{
		res.status(200),
		res.json(utils.returnTrueJsonData(null,'参数传入错误！'));
	}
});

//第三方用户注册/登录 POST
app.post('/api/user/otherReg',function(req,res){
	console.log('POST-->otherReg');
	//解析URL参数
	var params='';
	//通过resqust的data事件监听函数，每当收到请求体的数据没救累加到post中
	req.on('data',function(res){
		params+=res;
	});
	//出发end事件后，通过querystring.parse将POST解析为真正的POST请求格式，然后向客户端返回
	req.on('end',function(){
		params=querystring.parse(params);	
		if(null!=params){
			console.log('POST-->otherReg-->params：',params);
			user.otherRegister(params,function(disData){
				res.status(200),
				res.json(disData);
			});
		}else{
			res.status(200),
			res.json(utils.returnTrueJsonData(null,'参数传入错误！'));
		}
	});	
});


//账号密码形式用户注册 POST
app.post('/api/user/register',function(req,res){
	console.log('POST-->register');
	var params='';
	req.on('data',function(res){
		params+=res;
	});
	req.on('end',function(){
		params=querystring.parse(params);	
		if(null!=params){
			console.log('POST-->register-->params：',params);
			user.register(params,function(disData){
				res.status(200)
				res.json(disData);
			});
		}else{
			res.status(200),
			res.json(utils.returnTrueJsonData(null,'参数传入错误！'));
		}
	});	
});

//账号密码形式用户登录 POST
app.post('/api/user/login',function(req,res){
	console.log('POST-->login');
	var params='';
	req.on('data',function(res){
		params+=res;
	});
	req.on('end',function(){
		params=querystring.parse(params);	
		if(null!=params){
			console.log('POST-->login-->params：',params);
			user.login(params,function(disData){
				res.status(200)
				res.json(disData);
			});
		}else{
			res.status(200),
			res.json(utils.returnTrueJsonData(null,'请传入账号和密码！'));
		}
	});	
});

//根据手机号码下发验证码
app.post('/api/user/getPhoneCode',function(req,res){
	console.log('POST-->getPhoneCode');
	var params='';
	req.on('data',function(res){
		params+=res;
	});
	req.on('end',function(){
		params=querystring.parse(params);	
		if(null!=params){
			console.log('POST-->getPhoneCode-->params：',params);
			user.getCode(params,function(disData){
				res.status(200)
				res.json(disData);
			});
		}else{
			res.status(200),
			res.json(utils.returnTrueJsonData(null,'请传入手机号码！'));
		}
	})	
});

//修改密码
app.post('/api/user/changePassword',function(req,res){
	console.log('POST-->changePassword');
	var params='';
	req.on('data',function(res){
		params+=res;
	});
	req.on('end',function(){
		params=querystring.parse(params);	
		if(null!=params){
			console.log('POST-->changePassword-->params：',params);
			user.changePassword(params,function(disData){
				res.status(200)
				res.json(disData);
			});
		}else{
			res.status(200),
			res.json(utils.returnTrueJsonData(null,'请传入手机号码！'));
		}
	})	
});

//获取用户信息
app.post('/api/user/userinfo',function(req,res){
	console.log('POST-->userinfo');
	var params='';
	req.on('data',function(res){
		params+=res;
	});
	req.on('end',function(){
		params=querystring.parse(params);	
		if(null!=params){
			console.log('POST-->userinfo-->params：',params);
			user.userinfo(params,function(disData){
				res.status(200)
				res.json(disData);
			});
		}else{
			res.status(200),
			res.json(utils.returnTrueJsonData(null,'请传入手机号码！'));
		}
	})	
});


//================================================初始化======================================================

//初始化
app.post('/api/index/init',function(req,res){
	console.log('POST-->init');
	var params='';
	req.on('data',function(res){
		params+=res;	
	});
	req.on('end',function(){
		params=querystring.parse(params);
		if(null!=params){
			console.log('POST-->init-->params：',params);
			index.init(params,function(disData){
				res.status(200),
				res.json(disData);
			});
		}else{
			res.status(200),
			res.json(returnTrueJsonData(null,'参数不能为空'));
		}
	});
});

//首页
app.post('/api/index/index',function(req,res){
	console.log('POST-->index');
	var params='';
	req.on('data',function(res){
		params+=res;	
	});
	req.on('end',function(){
		params=querystring.parse(params);
		if(null!=params){
			console.log('POST-->index-->params：',params);
			index.index(params,function(disData){
				res.status(200),
				res.json(disData);
			});
		}else{
			res.status(200),
			res.json(returnTrueJsonData(null,'参数不能为空'));
		}
	});
});


app.get('/api/index/index',function(req,res){
	console.log('GET-->index-->');
		index.index(null,function(disData){
		res.status(200),
		res.json(disData);
	});
});


//==============================================获取商品列表===================================================


//获取商品分类
app.post('/api/goods/classlist',function(req,res){
	console.log('POST-->classlist');
	var params='';
	req.on('data',function(res){
		params+=res;	
	});
	req.on('end',function(){
		params=querystring.parse(params);
		if(null!=params){
			console.log('POST-->classlist-->params：',params);
			goods.getClassList(params,function(disData){
				res.status(200),
				res.json(disData);
			});
		}else{
			res.status(200),
			res.json(returnTrueJsonData(null,'请传入合法的参数'));
		}
	});
});

//GET请求示例,获取商品列表
app.get('/api/goods/goodList',function(req,res){
	console.log('GET-->goodList');
	var params=url.parse(req.url,true).query;
	if(null!=params){
		console.log('GET-->goodList-->params：',params);
		goods.getGoodList(params,function(disData){
			res.status(200),
			res.json(disData);
		});
	}else{
		res.status(200),
		res.json(utils.returnTrueJsonData(null,'请传入合法的参数'));
	}
});


//POST请求示例,获取商品列表
app.post('/api/goods/goodList',function(req,res){
	console.log('POST-->goodList');
	var params='';
	req.on('data',function(res){
		params+=res;	
	});
	req.on('end',function(){
		params=querystring.parse(params);
		if(null!=params){
			console.log('POST-->goodList-->params：',params);
			goods.getGoodList(params,function(disData){
				res.status(200),
				res.json(disData);
			});
		}else{
			res.status(200),
			res.json(returnTrueJsonData(null,'请传入合法的参数'));
		}
	});
});

//根据关键字搜索商品
app.post('/api/goods/search',function(req,res){
	console.log('POST-->search');
	var params='';
	req.on('data',function(res){
		params+=res;	
	});
	req.on('end',function(){
		params=querystring.parse(params);
		if(null!=params){
			console.log('POST-->search-->params：',params);
			goods.search(params,function(disData){
				res.status(200),
				res.json(disData);
			});
		}else{
			res.status(200),
			res.json(returnTrueJsonData(null,'请传入合法的参数'));
		}
	});
});


//返回商品详细信息
app.post('/api/goods/goodInfo',function(req,res){
	console.log('POST-->goodInfo')
	var params='';
	req.on('data',function(res){
		params+=res;
	});

	req.on('end',function(){
		params=querystring.parse(params);
		if(null!=params){
			console.log('POST-->goodInfo-->params：',params);
			goods.getGoodInfo(params,function(disData){
				res.status(200),
				res.json(disData);
			});
		}else{
			res.status(200),
			res.json(returnTrueJsonData(null,'请传入合法的参数'));
		}
	});
});

//获取商品的图片
app.post('/api/goods/goodsImg',function(req,res){
	console.log('POST-->goodsImg');
	var params='';
	req.on('data',function(res){
		params+=res;	
	});
	req.on('end',function(){
		params=querystring.parse(params);
		if(null!=params){
			console.log('POST-->goodsImg-->params：',params);
			goods.goodsImg(params,function(disData){
				res.status(200),
				res.json(disData);
			});
		}else{
			res.status(200),
			res.json(returnTrueJsonData(null,'请传入合法的参数'));
		}
	});
});

app.post('/api/goods/collect',function(req,res){
	console.log('POST-->collect');
	var params='';
	req.on('data',function(res){
		params+=res;	
	});
	req.on('end',function(){
		params=querystring.parse(params);
		if(null!=params){
			console.log('POST-->collect-->params：',params);
			userAction.collect(params,function(disData){
				res.status(200),
				res.json(disData);
			});
		}else{
			res.status(200),
			res.json(returnTrueJsonData(null,'请传入合法的参数'));
		}
	});
});


//获取用户收藏的列表
app.post('/api/userdata/collectlist',function(req,res){
	console.log('POST-->collectlist')
	let params='';
	req.on('data',function(res){
		params+=res;
	});
	req.on('end',function(){
		params=querystring.parse(params);
		if(null!=params){
			console.log('POST-->collectlist-->params：',params);
			userAction.getUserCollect(params,function(disData){
				res.status(200),
				res.json(disData);
			})
		}else{
			res.status(200),
			res.json(returnTrueJsonData(null,'请传入合法的参数'));
		}
	})
});

//用户提交浏览记录
app.post('/api/userdata/postTrack',function(req,res){
	console.log('POST-->postTrack')
	let params='';
	req.on('data',function(res){
		params+=res;
	});
	req.on('end',function(){
		params=querystring.parse(params);
		if(null!=params){
			console.log('POST-->postTrack-->params：',params);
			userAction.postTrack(params,function(disData){
				res.status(200),
				res.json(disData);
			})
		}else{
			res.status(200),
			res.json(returnTrueJsonData(null,'请传入合法的参数'));
		}
	})
});

//用户提交浏览记录
app.post('/api/userdata/trackList',function(req,res){
	console.log('POST-->trackList')
	let params='';
	req.on('data',function(res){
		params+=res;
	});
	req.on('end',function(){
		params=querystring.parse(params);
		if(null!=params){
			console.log('POST-->trackList-->params：',params);
			userAction.getTrackList(params,function(disData){
				res.status(200),
				res.json(disData);
			})
		}else{
			res.status(200),
			res.json(returnTrueJsonData(null,'请传入合法的参数'));
		}
	})
});


