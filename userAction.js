var db=require('./db.js')
var utils=require('./utils.js');
var async=require('async');

exports.getUserCollect =getUserCollect;
exports.postTrack=postTrack;
exports.getTrackList=getTrackList;
exports.collect=collect;

//收藏 state:0,反收藏 1:收藏 ug_id:用户ID和商品ID的结合品，唯一的
function collect(params,callBack) {
	if(null!=params&&null!=params.good_id&&null!=params.user_id&&null!=params.state){
		if(0==params.user_id){
			typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"用户ID不正确！"));	
			return
		}
		db.query("REPLACE INTO user_collect (ug_id,good_id,user_id,state) VALUES("+(params.good_id+params.user_id)+","+params.good_id+","+params.user_id+","+params.state+")",function(err,rows){
			if(err){
				console.log("连接数据库失败");
				typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"连接数据库失败"));
			}else{
				console.log("err="+err+",rows=",rows)
				if(null!=rows){
					typeof callBack=='function' &&callBack(utils.returnTrueJsonData({"user_id":params.user_id,"good_id":params.good_id,"is_collect":params.state},"操作成功"));
				}else{
					typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,'收藏失败！'+err));
				}
			}
		});
	}else{
		typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"获取失败，参数不正确"));		
	}
}

//一次性返回用户收藏的列表
function getUserCollect(params,callBack) {
	if(null!=params&&null!=params.user_id){
		if(0==params.user_id){
			typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"用户ID不正确"));
			return
		}
		db.getUserCollectLists(params.user_id,function(rows){
			if(null!=rows){
				let commednData=new Array();
				//让查询任务串行执行
				async.eachSeries(rows,function(item,callBack) {
					console.log("执行："+item.ug_id+"的查询操作")
					//根据推荐列表下得分类查找对应的商品列表，只取最多前四条
					db.query("SELECT * FROM goodlist WHERE good_id='"+item.good_id+"'",function(err,recommendlistData){
						console.log("查询"+item.ug_id+"的结果元素数量：",recommendlistData.length)
						for(var i = 0; i  < recommendlistData.length; i ++) {
	   						commednData.push(recommendlistData[i])
						} 
						callBack(null);
					});
				},function () {
					typeof callBack=='function' &&callBack(utils.returnTrueJsonData({"goodlist":commednData},'获取成功'));
				});
			}else{
				typeof callBack=='function' &&callBack(utils.returnTrueJsonData({"goodlist":null},"没有收藏记录"));
			}	
		});
	}else{
		typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"缺少必要参数"));
	}
}

//用户提交浏览记录
function postTrack(params,callBack){
	if(null!=params.user_id&&null!=params.good_id){
		const data=new Date();
		db.query("REPLACE INTO track_list (ug_id,user_id,good_id,good_name,good_cover,final_time,add_time) VALUES("+(params.good_id+params.user_id)+","+params.user_id+","+params.good_id+",'"+params.good_name+"','"+params.good_cover+"',"+data.getTime()+",'"+data.toLocaleString()+"')",function(err,rows){
			if(err){
				//new Data().toLocaleString()
				console.log("添加记录失败",rows)
				typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"添加浏览记录失败"));
			}else{
				if(null!=rows){
					console.log("添加记录成功",rows)
					typeof callBack=='function' &&callBack(utils.returnTrueJsonData({"data":'添加记录成功'},"添加记录成功"));
				}
			}
		});
	}else{
		typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"缺少必要参数"));
	}
}

//分页返回用户的浏览记录
var currentIndex=0;//列表到第几页了； 
var LINMIT_COUNT=10;//列表默认的分页加载数量
function getTrackList(params,callBack){
	if(null!=params.user_id&&null!=params.page){
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
		console.log('分页查询：page='+currentIndex+",limit="+LINMIT_COUNT)
		db.query("SELECT * FROM track_list WHERE user_id="+params.user_id+" ORDER BY final_time DESC LIMIT "+currentIndex+","+LINMIT_COUNT,function(err,rows){
			if(err){
				console.log("连接数据库失败",err)
				typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"连接数据库失败"));	
			}else{
				if(null!=rows&&rows.length>0){
					
					typeof callBack=='function' &&callBack(utils.returnTrueJsonData({"trackList":rows},"获取成功"));	
				}else{
					typeof callBack=='function' &&callBack(utils.returnTrueJsonData({"trackList":null},"没有更多了"));	
				}
			}
		});
	}else{
		typeof callBack=='function' &&callBack(utils.returnTrueJsonData(null,"缺少必要参数"));
	}
}

