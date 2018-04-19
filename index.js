var db=require('./db.js')
var utils=require('./utils.js');
var async=require('async');

exports.index=index;
exports.init=init;
//初始化
function init(params,callBack) {
	db.query("SELECT * FROM initdata",function(err,rows){
		if(err){
			typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"初始化失败"));
		}else{
			if(null!=rows&&rows.length>0){
	  			console.log("init-->初始化完成");
	  			typeof callBack=='function' &&callBack(utils.returnTrueJsonData(rows[0],'初始化完成'));
  			}else{
  				typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,'初始化完成'));
  			}
		}
	});
}

//返回首页的轮播图、推荐列表等
var count=0;
function index(params,callBack) {
	//查询广告Banner数据
	db.query("SELECT * FROM banner",function(err,bannerRows){
		if(null!=bannerRows&&bannerRows.length>0){
			console.log("banner查询完成且有数据:");
		}
		//查询所有分类中的TAB列表
		db.query("SELECT * FROM classlist WHERE tab =1",function(err,tabRows){
			if(null!=tabRows&&tabRows.length>0){
			console.log("tab查询完成且有数据:");
			}
			//查询搜索关键词数据	
			db.query("SELECT * FROM searchkey",function(err,keyRows){
				if(null!=keyRows&&keyRows.length>0){
				console.log("key查询完成且有数据:");
				}	
				//查询所有分类中的推荐列表
				db.query("SELECT * FROM classlist WHERE state=1",function(err,recomRows){
					if(null!=recomRows&&recomRows.length>0){
						console.log("推荐列表有数据:");
						//推荐列表的一维数组
						let commednData=new Array();
						//让查询任务串行执行
						async.eachSeries(recomRows,function(item,callBack) {
							console.log("执行："+item.parent_id+"的查询操作")
							//根据推荐列表下得分类查找对应的商品列表，只取最多前四条
							db.query("SELECT * FROM goodlist WHERE parent_id='"+item.parent_id+"' ORDER BY id DESC LIMIT 4",function(err,recommendlistData){
								console.log("查询"+item.parent_id+"的结果元素数量：",recommendlistData.length)
								//推荐列表分类下的二维数组
								commednData[count]=new Array();
								//一维数组的元素
								commednData[count]=item;
								//二维数组的列表元素
								commednData[count]["data"]=recommendlistData;
								count++;
								callBack(null);
							});
						},function () {
							count=0;
							typeof callBack=='function' &&callBack(utils.returnTrueJsonData({"banner":bannerRows,"tablist":tabRows,"autokey":keyRows,"recommendlist":commednData},'获取成功'));
						});
					}else{
						//如果推荐列表为空，不再查询了，直接返回结果
						typeof callBack=='function' &&callBack(utils.returnTrueJsonData({"banner":bannerRows,"tablist":tabRows,"autokey":keyRows,"recommendlist":null},'获取成功'));
					}	
				});
			});
		});
	});
}

// var count=0;
//这个版本是将推荐列表全部取出来放在一个数组中返回给客户端
// function index(params,callBack) {
// 	//查询广告Banner数据
// 	db.query("SELECT * FROM banner",function(err,bannerRows){
// 		if(null!=bannerRows&&bannerRows.length>0){
// 			console.log("banner查询完成且有数据:");
// 		}
// 		//查询所有分类中的TAB列表
// 		db.query("SELECT * FROM classlist WHERE tab =1",function(err,tabRows){
// 			if(null!=tabRows&&tabRows.length>0){
// 			console.log("tab查询完成且有数据:");
// 			}
// 			//查询搜索关键词数据	
// 			db.query("SELECT * FROM searchkey",function(err,keyRows){
// 				if(null!=keyRows&&keyRows.length>0){
// 				console.log("key查询完成且有数据:");
// 				}	
// 				//查询所有分类中的推荐列表
// 				db.query("SELECT * FROM classlist WHERE state=1",function(err,recomRows){
// 					if(null!=recomRows&&recomRows.length>0){
// 						console.log("推荐列表有数据:");
// 						//推荐列表的一维数组
// 						let commednData=new Array();
// 						//让查询任务串行执行
// 						async.eachSeries(recomRows,function(item,callBack) {
// 							console.log("执行："+item.parent_id+"的查询操作")
// 							//根据推荐列表下得分类查找对应的商品列表，只取最多前四条
// 							db.query("SELECT * FROM goodlist WHERE parent_id='"+item.parent_id+"' ORDER BY id DESC LIMIT 4",function(err,recommendlistData){
// 								console.log("查询"+item.parent_id+"的结果元素数量：",recommendlistData.length)
// 								//推荐列表分类下的二维数组
// 								for(var i = 0; i  < recommendlistData.length; i ++) {
//    									commednData.push(recommendlistData[i])
// 								} 
// 								callBack(null);
// 							});
// 						},function () {
// 							count=0;
// 							typeof callBack=='function' &&callBack(utils.returnTrueJsonData({"banner":bannerRows,"tablist":tabRows,"autokey":keyRows,"recommendlist":commednData},'获取成功'));
// 						});
// 					}else{
// 						//如果推荐列表为空，不再查询了，直接返回结果
// 						typeof callBack=='function' &&callBack(utils.returnTrueJsonData({"banner":bannerRows,"tablist":tabRows,"autokey":keyRows,"recommendlist":null},'获取成功'));
// 					}	
// 				});
// 			});
// 		});
// 	});
// }