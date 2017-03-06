var util = {};

util.url = "http://192.168.21.101:8080";


util.getLocalTime = function(nS) {     
   return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/,' ');
}
util.checkEmail =function(email) {
	email = email || '';
	return (email.length > 3 && email.indexOf('@') > -1);
};

util.isEmpty =function(str) {
	return str.trim() == "" ? true:false;
};

util.isnotEmpty = function(str){
	return !util.isEmpty(str);
}
util.doc = function(id){
	return document.getElementById(id);
}


//MUI ajax
util.ajax = function(obj){
	mui.ajax(util.url+obj.url,{
		data:obj.data,
		dataType:'json',//服务器返回json格式数据
		type:obj.type,//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		crossDomain:true,
		headers:{'Content-Type':'application/json'},
		success:function(data){
			if(obj.success){obj.success(data)}
		},
		error:function(xhr,type,errorThrown){
			//异常处理；
			mui.alert(type+errorThrown,'title','btnValue',function (e) {
			   e.index
			},'div')
		}
	});
	
}
//时间戳转换
util.formatMsgTime = function(creattime,nowtime) {
  var dateTime = new Date(creattime);

  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  var hour = dateTime.getHours();
  var minute = dateTime.getMinutes();
  var second = dateTime.getSeconds();
  var now = new Date(nowtime);

  var milliseconds = 0;
  var timeSpanStr;

  milliseconds = nowtime - creattime;

  if (milliseconds <= 1000 * 60 * 1) {
    timeSpanStr = '刚刚';
  }
  else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
    timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
  }
  else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
    timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
  }
  else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
    timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
  }
  else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year == now.getFullYear()) {
    timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
  } else {
    timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
  }
  return timeSpanStr;
};


