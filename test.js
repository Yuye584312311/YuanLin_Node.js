
var db =require('./db.js');


//将要最终执行的代码Promise化一下
// var sleep = function (time) {
//     return new Promise(function (resolve, reject) {
//         setTimeout(function () {
//             resolve("这里是执行完成的结果");
//             //(失败了reject)
//         }, time);
//     })
// };

// //加上 async 同步处理
// const start =async function () {
//     // 在这里使用起来就像同步代码那样直观
//     try{
// 		console.log('start');
// 	    let data=await sleep(3000);//等待Promise返回了结果，再执行sleep函数
// 	    //只有上面的执行完成才会走到下一步
// 	    console.log('end,结果：'+data);
//     }catch(res){
//     	console.log("error:res:"+res)
//     }
// };
// start();

//保证同步支执行
var insertDataTaskPromise=function(position){
    return new Promise(function (resolve, reject) {
       db.query("insert into test_data (name,age) values ('张三"+position+"','25')",function(err,rows){
            if(err){
                console.log("数据插入失败")
            }else{
                resolve("数据插入成功");
            }
        });
    })
}

const insertData =async function () {
    let page=0;
    for (var i = 0; i < 1000; i++) {
        page++;
      try{
        let data=await insertDataTaskPromise(i);
        console.log("已经插入"+page+"页");
      }catch(res){
        console.log("error:res:"+res)
      }
    }
};


var queryLimitData=function(start,count){
    console.log("开始查询："+start+",count="+count)
    return new Promise(function (resolve, reject) {
       db.query("SELECT * FROM test_data LIMIT "+start+","+count+"",function(err,rows){
            if(err){
                console.log("查询数据库失败")
            }else{
                resolve(rows);
            }
        });
    })
}

var start=0;
var COUNT=100;
var isNext=true; 
var page=0;

const queryAllData =async function () {
    while(isNext){
       try{
        let data=await queryLimitData(start,COUNT);
        if(null!=data&&data.length>=COUNT){
            start=(start+data.length+1);
            page++;
        }else{
           isNext=false; 
           console.log("所有数据查询完毕,总计"+page+"页")
        }
      }catch(res){
        console.log("error:res:"+res)
      }     
    }
};

// insertData();//插入数据

queryAllData()//查询数据
