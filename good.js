var db =require('./db.js');
var utils=require('./utils.js');

exports.getGoodList=getGoodList;
exports.getGoodInfo=getGoodInfo;
exports.search=search;
exports.getClassList=getClassList;
exports.goodsImg=goodsImg;


//获取所有的分类列表
function getClassList(params,callBack) {
	db.query("SELECT * FROM classlist ",function(err,rows){
		if(err){
			typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"连接数据库失败"));	
		}else{
			typeof callBack=='function' &&callBack(utils.returnTrueJsonData({"classlist":rows},'获取成功'));
		}
	});
}

//根据分类分页返回商品列表
var currentIndex=0;//列表到第几页了； 
var LINMIT_COUNT=10;//列表默认的分页加载数量

function getGoodList(params,callBack){
	if(null!=params&&null!=params.parent_id&&null!=params.page){
		if(params.page<=0){
			typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"页眉不能小于1"));	
			return
		}
		if(1==params.page){
			currentIndex=0;
		}else{
			currentIndex=(params.page-1)*10;
		}
		//客户端指定的一页数量
		if(null!=params.page_size&&params.page_size>0){
			LINMIT_COUNT=params.page_size;
		}
		console.log('分页加载：page='+currentIndex+",limit="+LINMIT_COUNT)
		var SQL="SELECT * FROM goodlist WHERE parent_id='"+params.parent_id+"' LIMIT "+currentIndex+","+LINMIT_COUNT
		if(params.parent_id==0){
			console.log("获取全部列表")
			SQL="SELECT * FROM goodlist LIMIT "+currentIndex+","+LINMIT_COUNT
		}
		db.query(SQL,function(err,rows){
			if(err){
				typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"连接数据库失败"));	
			}else{
				if(null!=rows&&rows.length>0){
					typeof callBack=='function' &&callBack(utils.returnTrueJsonData({"goodlist":rows},'获取成功'));
				}else{
					typeof callBack=='function' &&callBack(utils.returnTrueJsonData({"goodlist":null},'没有更多了'));
				}
			}
		});

	}else{
		typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"获取失败，参数不正确"));	
	}
}


//搜索,查询像XXX关键字的模糊查询,分页检索
var currentSearchIndex=0;//搜索列表到第几页了； 
var LINMIT_SEARCH_COUNT=10;//搜索列表默认的分页加载数量

function search(params,callBack){
	if(null!=params&&null!=params.search_key&&null!=params.page){
		if(params.page<=0){
			typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"页眉不能小于1"));	
			return
		}
		if(1==params.page){
			currentSearchIndex=0;
		}else{
			currentSearchIndex=(params.page-1)*10;
		}
		//客户端指定的一页数量
		if(null!=params.page_size&&params.page_size>0){
			LINMIT_SEARCH_COUNT=params.page_size;
		}
		db.query("SELECT * FROM goodlist WHERE good_name LIKE '%"+params.search_key+"%' LIMIT "+currentSearchIndex+","+LINMIT_SEARCH_COUNT,function(err,rows){
			if(err){
				console.log("连接数据库失败");
				typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"连接数据库失败"));
			}else{
				if(null!=rows&&rows.length>0){
					typeof callBack=='function' &&callBack(utils.returnTrueJsonData({"goodlist":rows},'获取成功'));
				}else{
					typeof callBack=='function' &&callBack(utils.returnTrueJsonData({"goodlist":null},'没有更多了'));
				}
			}	
		});
	}else{
		typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,'请传入搜索的关键字'));
	}
}

//获取商品详细信息
function getGoodInfo(params,callBack){
	if(null!=params&&null!=params.good_id){
		try{
			db.query("SELECT * FROM goodlist WHERE good_id ='"+params.good_id+"'",function(err,rows){
				if(err){
					console.log("连接数据库失败");
					typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"连接数据库失败"));
				}else{
					if(null!=rows&&rows.length>0){
						//用户登陆了，且ID符合条件，查看是否收藏过此商品
						if(null!=params.user_id){
							db.query("SELECT * FROM user_collect WHERE ug_id="+(params.good_id+params.user_id),function(err,collectRows){
							//查询失败直接返回商品信息	
							if(err){
								console.log("连接数据库失败");
								typeof callBack=='function' &&callBack(utils.returnTrueJsonData(rows[0],'获取成功'));
							}else{
								if(null!=collectRows&&null!=collectRows[0]){
										//将收藏标识返回用户
										rows[0].is_collect=collectRows[0].state;
										typeof callBack=='function' &&callBack(utils.returnTrueJsonData(rows[0],'获取成功'));
									}else{
										typeof callBack=='function' &&callBack(utils.returnTrueJsonData(rows[0],'获取成功'));
									}
								}
							});
							//用户未登陆，直接返回商品信息
						}else{
							typeof callBack=='function' &&callBack(utils.returnTrueJsonData(rows[0],'获取成功'));
						}
					}else{
						typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,'找不到该商品信息'));
					}
				}
			});
		}catch(res){
			typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"获取失败，内部错误"));	
		}
		
	}else{
		typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"获取失败，参数不正确"));	
	}	
}

//获取商品的图片列表
function goodsImg(params,callBack){
	if(null!=params&&null!=params.good_id){
		db.query("SELECT * FROM goods_img WHERE good_id ='"+params.good_id+"'",function(err,rows){
			if(err){
				console.log("连接数据库失败");
				typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"连接数据库失败"));
			}else{
				if(null!=rows&&rows.length>0){
					typeof callBack=='function' &&callBack(utils.returnTrueJsonData(rows,'获取成功'));
				}else{
					typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,'找不到该商品信息'));
				}
			}
		});
	}else{
		typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"获取失败，参数不正确"));	
	}	
}