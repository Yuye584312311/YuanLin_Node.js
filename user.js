var db=require('./db.js')
var utils=require('./utils.js');

exports.otherRegister = otherRegister;
exports.getCode=getCode;
exports.register=register;
exports.login=login;
exports.changePassword=changePassword;
exports.userinfo=userinfo;


//第三方用户的注册\登录
async function otherRegister(params,callBack){
   if(null!=params.openid){
	  //将数据表中的OPENID设置为唯一索引，直接插入数据，强制性的有就覆盖，没有就新插入一列
	  let regResult=await db.asyncQuery("REPLACE INTO userinfo (uid,openid,nickname,city,face,add_time,login_type,sex) VALUES ('"+params.uid+"','"+params.openid+"','"+params.nickname+"','"+params.city+"','"+params.face+"','"+new Date().toLocaleString()+"','"+params.login_type+"','"+params.sex+"')");
	  if(0==regResult){
		  	console.log("连接数据库表失败")
			typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,'注册失败'));
	  }else{
		  	let userData= await db.asyncQuery("SELECT * FROM userinfo WHERE openid='"+params.openid+"'");
			  	if(0==userData){
	  			typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,'注册账号失败，内部发生了错误！'));
		  	}else{
	  			console.log("注册成功")
	  			typeof callBack=='function' &&callBack(utils.returnTrueJsonData(userData[0],'注册成功'));
		  	} 
	  }
   }else{
   	  	typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"缺少必要参数"));
   }
}

//账号密码的用户注册
function register(params,callBack){
	if(null!=params&&null!=params.account&&null!=params.password&&null!=params.code){
		//查询用户手机号码下面的是否存在已注册的用户
		db.query("SELECT * FROM userinfo WHERE account='"+params.account+"'",function(err,rows){
			if(err){
				typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"连接数据库失败"));	
			}else{
				if(null!=rows&&rows.length>0){
	  				typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,'该用户已存在！请直接登录'));
				}else{
					db.query("insert into userinfo (uid,openid,nickname,account,phonenumber,password,add_time,login_type,sex) values ('"+params.uid+"','"+params.account+"','用户"+params.account+"','"+params.account+"','"+params.account+"','"+params.password+"','"+new Date().toLocaleString()+"','"+params.login_type+"','"+params.sex+"')",function(err,rows){
						if(err){
							console.log("注册账号失败，数据库发生了错误！")
							typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,'注册账号失败，数据库发生了错误！'));
						}else{
							db.query("SELECT * FROM userinfo WHERE account='"+params.account+"'",function(err,rows){
								if(err){
									console.log("数据库查询失败"+err)
									typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,'数据库查询失败'));
								}else{
									console.log("注册成功")
									typeof callBack=='function' &&callBack(utils.returnTrueJsonData(rows[0],'注册成功'));
								}
							})
						}
	  				});
				}
			}
		});
	}else{
		typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"注册失败，参数不正确"));	
	}
}

//用户登录
function login(params,callBack){
  if(null!=params&&null!=params.account&&null!=params.password){
		//查询账号是否存在
		db.query("SELECT * FROM userinfo WHERE account='"+params.account+"'",function(err,rows){
			if(err){
				typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"连接数据库失败"));	
			}else{
				if(null!=rows&&rows.length>0){
					console.log(rows)
					//比对登录密码
					console.log(rows[0].password)
					if(params.password==rows[0].password){
						console.log("密码匹配相等")
						typeof callBack=='function' &&callBack(utils.returnTrueJsonData(rows[0],'登录成功！'));
					}else{
						console.log("密码错误！")
						typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,'密码错误！'));
					}
				}else{
					console.log("该账号不存在，请先注册！")
					typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,'该账号不存在，请先注册！'));
				}
			}
		});
	}else{
		typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"注册失败，参数不正确"));	
	}
}

//修改密码,先校验用户手机号码
function changePassword(params,callBack){
  if(null!=params&&null!=params.account&&null!=params.code){
		//查询账号是否存在
		db.query("SELECT * FROM userinfo WHERE account='"+params.account+"'",function(err,rows){
			if(err){
				typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"连接数据库失败"));	
			}else{
				if(null!=rows&&rows.length>0){
					console.log(rows)
					db.query("UPDATE userinfo SET password='"+params.password+"'WHERE account='"+params.account+"'",function(err,rows){
						if(err){
							console.log("修改密码失败！连接数据库错误:"+err)
							typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"修改密码失败！连接数据库错误"));	
						}else{
							console.log("修改密码成功")
							typeof callBack=='function' &&callBack(utils.returnTrueJsonData({"acount":params.account,"password":params.password},"修改密码成功"));	
						}
					});
				}else{
					console.log("该账号不存在，请先注册！")
					typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,'该账号不存在，请先注册！'));
				}
			}
		});
	}else{
		typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"修改密码失败，参数不正确"));	
	}
}

//获取用户的额基本信息
async function userinfo(params,callBack){
	try{
		//查询用户信息
		let rows=await db.asyncQuery("SELECT * FROM userinfo WHERE id='"+params.user_id+"'");
		if(0==rows){
			console.log("连接数据库失败")
			typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"获取用户信息失败"));	
		}else{
			if(null!=rows&&rows.length>0){
				let collectCount= await db.queryUserCollectCount(rows[0].id);
				let trackCount= await db.queryUserTrackCount(rows[0].id);
				console.log("用户收藏个数："+collectCount+",用户浏览个数："+trackCount)
				rows[0].collect_count=collectCount;
				rows[0].track_count=trackCount;
				typeof callBack=='function' &&callBack(utils.returnTrueJsonData(rows[0],'获取用户信息成功'));
			}else{
				typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,'该用户不存在'));
			}
		}
	}catch(err){
		console.log(err)
		typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"获取用户信息失败"));	
	}
}



//获取验证码
function getCode(params,callBack){
	if(null!=params&&null!=params.phone){
		typeof callBack=='function' &&callBack(utils.returnTrueJsonData("手机号码："+params.phone+"的验证码已成功下发"));	
	}else{
		typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"获取验证码失败！参数不正确"));	
	}
}

