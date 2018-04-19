var mysql=require('mysql')

//=====================================mysql=========================================

/**
1：数据表：app_data->userinfo 用户信息
mysql> CREATE TABLE IF NOT EXISTS userinfo(
    -> id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    -> uid VARCHAR(255) NOT NULL,
    -> openid VARCHAR(255) NOT NULL,
    -> nickname VARCHAR(20) NULL,
    -> city VARCHAR(20) NULL,
    -> face VARCHAR(255),
    -> phonenumber VARCHAR(255) NULL,
    -> account VARCHAR(255) NULL,
    -> password VARCHAR(255) NULL,
    -> add_time DATETIME NOT NULL,
    -> login_type VARCHAR(5) NULL,
    -> sex VARCHAR(20) NULL,
    -> UNIQUE KEY(openid)
    -> );
Query OK, 0 rows affected (0.02 sec)

2：数据表：app_data->goodlist 所有商品
mysql> CREATE TABLE IF NOT EXISTS goodlist(
    -> id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    -> good_id BIGINT UNSIGNED,
    -> good_name VARCHAR(255) NULL,
    -> good_price VARCHAR(20) NULL,
    -> good_cover VARCHAR(255) NULL,
    -> good_desp VARCHAR(255) NULL,
    -> good_class VARCHAR(20) NULL,
    -> good_type VARCHAR(10) NULL,
    -> good_location VARCHAR(255) NULL,
    -> good_mail VARCHAR(20) NULL,
    -> good_volume INT DEFAULT 0,
    -> share_times INT DEFAULT 0,
    -> collect_times INT DEFAULT 0,
    -> look_times INT DEFAULT 0,
    -> add_time DATETIME NOT NULL,
    -> web_url VARCHAR(255) NULL,
    -> video_url VARCHAR(255) NULL,
    -> parent_id SMALLINT UNSIGNED DEFAULT 1;
    -> cover_width SMALLINT UNSIGNED DEFAULT 280,
    -> cover_height SMALLINT UNSIGNED DEFAULT 350,
    -> sellnum BIGINT UNSIGNED DEFAULT 0,
    -> frommail SMALLINT UNSIGNED DEFAULT 0
    -> );
Query OK, 0 rows affected (0.01 sec)

3：数据表：app_data->initdata AppStyle和广告等初始化配置信息

mysql> CREATE TABLE IF NOT EXISTS initdata(
    -> ad_title VARCHAR(255) NULL,
    -> ad_url VARCHAR(255) NULL,
    -> good_id VARCHAR(20) NULL,
    -> ad_cover VARCHAR(255) NULL,
    -> search_color VARCHAR(20) NULL,
    -> banner_color VARCHAR(20) NULL,
    -> banner_height SMALLINT UNSIGNED DEFAULT 500,
    -> contacts_phone VARCHAR(20) NULL,
    -> ad_durtion SMALLINT UNSIGNED DEFAULT 5,
    -> apk_download_url VARCHAR(255) NULL,
    -> square_banner_color VARCHAR(255) NULL
    -> );
Query OK, 0 rows affected (0.04 sec)

4：数据表：app_data->banner APP首页幻灯片广告
mysql> CREATE TABLE banner(
    -> id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    -> good_id VARCHAR(20) NOT NULL,
    -> web_url VARCHAR(255)NULL,
    -> video_url VARCHAR(255) NULL,
    -> title VARCHAR(20) NULL,
    -> desp VARCHAR(100) NULL,
    -> cover VARCHAR(255) NOT NULL
    -> );

5：数据表：app_data->searchkey APP首页自动轮播滚动的搜索关键字
mysql> CREATE TABLE searchkey(
    -> id SMALLINT UNSIGNED NOT NULL,
    -> key_type SMALLINT UNSIGNED NULL,
    -> key_name VARCHAR(20) NOT NULL
    -> );
Query OK, 0 rows affected (0.01 sec)

6：数据表：app_data->classlist 所有的分类，根据state来确定哪些在首页TAB栏显示，哪些在首页推荐列表显示，哪些在所有分类列表中显示
mysql> CREATE TABLE classlist(
    -> id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    -> parent_id SMALLINT UNSIGNED NOT NULL,
    -> type_id SMALLINT UNSIGNED NULL,
    -> parent_name VARCHAR(20) NOT NULL,
    -> state SMALLINT UNSIGNED DEFAULT 0,
    -> tab SMALLINT UNSIGNED DEFAULT 0,
    -> icon VARCHAR(255) NULL,
    -> tab_title VARCHAR(20) NULL
    -> );
Query OK, 0 rows affected (0.01 sec)


表字段说明:
state:如果是1，表明设置为了推荐将会在首页显示
tab:状态为0：不是首页菜单类型，1：首页菜单类型
icon:这个table的icon图标
tab_title:tab专用名称描述

7：数据表：app_data->goods_img 用于存放商品相关的图片文件
 mysql> CREATE TABLE goods_img(
    -> id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    -> good_id BIGINT UNSIGNED DEFAULT 0,
    -> width SMALLINT UNSIGNED,
    -> height SMALLINT UNSIGNED,
    -> title VARCHAR(20) NULL,
    -> img_url VARCHAR(255) NOT NULL,
    -> state SMALLINT UNSIGNED DEFAULT 0);
Query OK, 0 rows affected (0.03 sec)


9:数据库user_collect  ug_id：用户ID和商品ID的唯一值
mysql> CREATE TABLE user_collect(
    -> id SMALLINT,
    -> ug_id SMALLINT UNSIGNED PRIMARY KEY,
    -> good_id SMALLINT UNSIGNED,
    -> user_id SMALLINT UNSIGNED,
    -> state INT(10) DEFAULT 0,
    -> UNIQUE KEY(ug_id)
    -> );
Query OK, 0 rows affected (0.01 sec)

10：数据表 track_list ，用户的浏览记录， add_time：年月日,ug_id:记录的唯一索引
mysql> CREATE TABLE track_list(
    -> user_id BIGINT UNSIGNED NOT NULL,
    -> good_id BIGINT UNSIGNED NOT NULL,
    -> good_name VARCHAR(255) NULL,
    -> good_cover VARCHAR(255) NULL,
    -> add_time DATE NOT NULL,
    -> ug_id SMALLINT UNSIGNED NOT NULL,
    -> final_time BIGINT NOT NULL,
    -> UNIQUE KEY(ug_id)
    -> );
Query OK, 0 rows affected (0.01 sec)
1:修改用户表(userinfo)中的openid字段，修改第三方登录注册逻辑

3-23：
1：修改数据库中的banner高度单位，由像素改为DP
2：initdata表中增加字段：ad_durtion 广告播放的时间，单位秒
mysql> ALTER TABLE initdata ADD COLUMN ad_durtion SMALLINT UNSIGNED DEFAULT 5
;
Query OK, 1 row affected (0.04 sec)
Records: 1  Duplicates: 0  Warnings: 0

//4-2 initdata增加字段
mysql> ALTER TABLE initdata ADD COLUMN apk_download_url VARCHAR(255) NULL;
mysql> ALTER TABLE initdata ADD COLUMN square_banner_color VARCHAR(255) NULL;

4-18新创建数据库
mysql> CREATE TABLE IF NOT EXISTS test_data(
    -> id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    -> name VARCHAR(255) NULL,
    -> age SMALLINT);
Query OK, 0 rows affected (0.05 sec)
*/

var pool=mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'app_data'
});

//普通查询
function query(sql,callBack){
	pool.getConnection(function(errMsg,connection){
		connection.query(sql,function(err,rows){
			console.log("MySql语句："+sql)
			if(err){
				console.log(err)
			}
			connection.release();
			typeof callBack=="function" &&callBack(err,rows);
		})
	})
}

//采用Promise化标准处理 失败返回0
function asyncQuery(sql){
    return new Promise(function(resolve,reject){
        query(sql,(err,rows)=>{
            if(err){
                console.log(err)
                resolve(0)
            }
            resolve(rows)
        })
    });
}


//查询用户收藏记录个数
function queryUserCollectCount(user_id){
    return new Promise(function(resolve,reject){
        query("SELECT * FROM user_collect WHERE user_id='"+user_id+"' and state='1'",(err,rows)=>{
            if(err){
                resolve(0)
            }
            if(null!=rows&&rows.length>0){
                resolve(rows.length)    
            }
            resolve(0)  
        });
    });
}

//返回用户所有的收藏记录
function getUserCollectList(user_id){
    return new Promise(function(resolve,reject){
        query("SELECT * FROM user_collect WHERE user_id='"+user_id+"' and state='1'",(err,rows)=>{
            if(err){
                resolve(0)
            }
            resolve(rows) 
        });
    });
}


//查询用户浏览记录个数
function queryUserTrackCount(user_id){
    return new Promise(function(resolve,reject){
        query("SELECT * FROM track_list WHERE user_id="+user_id,(err,rows)=>{
            if(err){
                resolve(0)
            }
            if(null!=rows&&rows.length>0){
                resolve(rows.length)    
            }
            resolve(0)  
        });
    });
}

//查询指定用户收藏记录的所有数据
function getColloctLists(user_id,callBack){
  return new Promise((resolve, reject) => {
    query("SELECT * FROM user_collect WHERE user_id='"+user_id+"' and state='1'",(err,rows)=>{
        if(err){
            reject(err);
        }
        callBack(rows);
    });
  });
};

async function getUserCollectLists(user_id,callBack) {
 try {
    await getColloctLists(user_id,callBack);
  } catch (err) {
    console.log("err",err);
  }
}

exports.query=query;
exports.asyncQuery=asyncQuery;
exports.queryUserTrackCount=queryUserTrackCount;
exports.queryUserCollectCount=queryUserCollectCount;
exports.getUserCollectList=getUserCollectList;
exports.getUserCollectLists=getUserCollectLists
