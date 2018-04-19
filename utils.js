exports.returnTrueJsonData=returnTrueJsonData;

//包装正确的Data
function returnTrueJsonData(jsonData,msg){
  return {data:jsonData,msg:msg,code:200}
}
