var index = {}

index.fn = function(){
	//默认没有登录
	this.userflag = false;//用来判断用户是否登录
	this.qnum = 0;//问题列表分页
	this.cnum = 0;//文章列表分页
	this.wnum = 0;//wiki列表分页
	this.selectflag = false;
}

index.fn.prototype.main = function(){
	var self = this;
	mui.init({
	  preloadPages:[
	    {
	      url:'docs/write.html',
	      id:'write', 
	    }
	    
	  ],
	  preloadLimit:5//预加载窗口数量限制(一旦超出,先进先出)默认不限制
	});
	mui.plusReady(function(){
        //获取用户信息;
		self.getusername();
		//plus.storage.clear(); 
    });
    
    self.userlogowarp = mui("#offCanvasSide .userwrap");
    self.offCanvasSideScroll = mui('#offCanvasSideScroll');
	 //侧滑容器父节点
	 //主界面和侧滑菜单界面均支持区域滚动；
	self.offCanvasSideScroll.scroll();
	mui('#offCanvasContentScroll').scroll();
	//阻尼系数
	var deceleration = mui.os.ios?0.003:0.0009;
	mui('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration:deceleration
	});
	
	 //实现ios平台原生侧滑关闭页面；
	if (mui.os.plus && mui.os.ios) {
		mui.plusReady(function() { //5+ iOS暂时无法屏蔽popGesture时传递touch事件，故该demo直接屏蔽popGesture功能
			plus.webview.currentWebview().setStyle({
				'popGesture': 'none'
			});
		});
	}
	
	//退出登录
	self.offCanvasSideScroll.on('tap','.mysetnav .loginout',function(e){
		var btnArray = ['否', '是'];
		mui.confirm('您确认退出登录？', '消息', btnArray, function(e) {
			if (e.index == 1) {
				self.loiginout() 
			}
		})
		
	})
	
	self.offCanvasSideScroll.on("tap",".mui-table-view-cell .mybtn",function(e){
		var that = this;
		if(self.userflag){
			localStorage.setItem("typelist",that.getAttribute("data-mydata")); 
			var nwaiting = plus.nativeUI.showWaiting();//显示原生等待框
			    webviewContent= plus.webview.create("docs/attention.html");//后台创建webview并打开show.html
			    webviewContent.addEventListener("loaded", function() { //注册新webview的载入完成事件
			        nwaiting.close(); //新webview的载入完毕后关闭等待框
		        webviewContent.show("slide-in-right",200); //把新webview窗体显示出来，显示动画效果为速度200毫秒的右侧移入动画
		    }, false);
		}else{ 
			 self.openloginviews();
		}
		
	})
	
	
	
	mui("#headerbox").on("tap",'.search',function(){
		mui.openWindow({
			url: 'docs/search.html',
			id: 'search',
			preload: true,
			show: {
				aniShow: 'pop-in'
			},
			styles: {
				popGesture: 'hide'
			},
			waiting: {
				autoShow: false
			}
		});
	})
	self.tabonclick = function(){
		mui("#itemwrapper").on('tap',".mui-table-view .a-list",function(){
		var tid = this.getAttribute('data-qsid');
		var type = this.getAttribute('data-lstype');
		localStorage.setItem("detailid",tid);
		localStorage.setItem("lstype",type);
		var nwaiting = plus.nativeUI.showWaiting();//显示原生等待框
	    webviewContent= plus.webview.create("docs/detail.html");//后台创建webview并打开show.html
	    webviewContent.addEventListener("loaded", function() { //注册新webview的载入完成事件
	    	var ws = plus.webview.getWebviewById('detail');
	        nwaiting.close(); //新webview的载入完毕后关闭等待框
        	webviewContent.show("slide-in-right",200); //把新webview窗体显示出来，显示动画效果为速度200毫秒的右侧移入动画
		}, false);
		});
		
		mui("#itemwrapper").on('tap',".mui-table-view .b-list",function(){
			var tid = this.getAttribute('data-qsid');
			var type = this.getAttribute('data-lstype');
			localStorage.setItem("detailid",tid);
			localStorage.setItem("lstype",type);
			var nwaiting = plus.nativeUI.showWaiting();//显示原生等待框
		    webviewContent= plus.webview.create("docs/nav-detail.html");//后台创建webview并打开show.html
		    webviewContent.addEventListener("loaded", function() { //注册新webview的载入完成事件
		    	var ws = plus.webview.getWebviewById('detail');
		        nwaiting.close(); //新webview的载入完毕后关闭等待框
	        	webviewContent.show("slide-in-right",200); //把新webview窗体显示出来，显示动画效果为速度200毫秒的右侧移入动画
			}, false);
		})
	}
	
	
	mui("#headerbox").on("tap",'.echarts',function(){
		mui.openWindow({
			url: 'docs/echarts.html', 
			id: 'echarts',
			preload: true,
			show: {
				aniShow: 'pop-in'
			},
			styles: {
				popGesture: 'hide'
			},
			waiting: {
				autoShow: false
			}
		});
	})
	
	
	//登陆注册转新的页面
	mui(self.userlogowarp).on('tap','.loginbtn',function(){
		self.openloginviews();
	}, false);
	
	
	//写文章
	mui("#popover").on('tap',".wirtenav",function(){
		var that = this;
		if(self.userflag){
			var write = plus.webview.getWebviewById('write');
			 mui.fire(write,'mywrite',{
			    type:that.getAttribute("data-mydata")
			 });
	  		self.openwriteviews();
		}else{
			self.openloginviews();
		}
	})
	
	
	window.addEventListener('userlogo',function(event){
	  //用户登录获得事件参数
	  var success = event.detail.success;
	  //登录用户渲染逻辑
	  if(success){
	  	self.userflag = true;
	  	self.loginwrite()
	  }
	});
	self.listcanvas();
	self.slide();
	self.tabonclick();
}

index.fn.prototype.openwriteviews = function(){
	mui.openWindow({
		url: 'docs/write.html',
		id:'write',
		preload: true,
		show: {
			aniShow: 'pop-in'
		},
		styles: {
			popGesture: 'hide'
		},
		waiting: {
			autoShow: false
		}
	});
}



index.fn.prototype.openloginviews = function(){
	mui.openWindow({
		url: 'docs/login.html',
		id: 'login',
		preload: true,
		show: {
			aniShow: 'pop-in'
		},
		styles: {
			popGesture: 'hide'
		},
		waiting: {
			autoShow: false
		}
	});
}

//初始化渲染
index.fn.prototype.getusername = function(){
	var self = this,
		value,
	value = plus.storage.getItem("userId");
	if(value!==null){
		self.userflag = true;
		self.loginwrite();
	}else{
		self.userflag = false;
		self.loginoutWrite();
	}
}


//登录用户的渲染逻辑
index.fn.prototype.loginwrite = function(){
	var self = this,
		arr = [],
		arr2 = [];
	arr.push('<div class="usermessage">')
		arr.push('<a href="javascript:void(0)" class="updatalogo">');
			arr.push('<div class="userlogo moren"></div>');
				arr.push('<div class="usernamewrap">');
					arr.push('<p class="content">'+plus.storage.getItem("username")+'</p>');
				arr.push('</div>');
			arr.push('<div class="mui-clearfix"></div>');
		arr.push('</a>');
	arr.push('</div>');
	arr2.push('<ul class="mui-table-view mysetnav">');
	    arr2.push('<li class="mui-table-view-cell">');
	    	arr2.push('<a href="javascript:void(0)" class="loginout">');
	    		arr2.push('<span class="mui-icon mui-icon-gear"></span><span> 退出登录</span>');
	    	arr2.push('</a>');
	    arr2.push('</li>');
	arr2.push('</ul>');
	mui('#offCanvasSideScroll .usernav')[0].innerHTML+=(arr2.join(""));
	self.userlogowarp[0].innerHTML = arr.join("");
}

//注销登录渲染逻辑
index.fn.prototype.loginoutWrite = function(){
	var self = this,
		arr = [];
	arr.push('<div class="usermessage">')
			arr.push('<a href="javascript:void(0)" class="loginbtn">');
				arr.push('<div class="userlogo nologin"></div>');
					arr.push('<div class="usernamewrap">');
						arr.push('<p class="content">登陆/注册</p>');
					arr.push('</div>');
				arr.push('<div class="mui-clearfix"></div>');
			arr.push('</a>');
		arr.push('</div>');
	self.userlogowarp[0].innerHTML = arr.join("");
}


index.fn.prototype.loiginout = function(){
	var self = this,
		nav;
	self.userflag = false;
	plus.storage.clear();
	self.loginoutWrite();
	nav = mui('#offCanvasSideScroll .usernav')[0]
	nav.removeChild(nav.lastChild);
	
}


index.fn.prototype.listcanvas = function(){ 
		var self = this;
			//循环初始化所有下拉刷新，上拉加载。
		mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
				mui(pullRefreshEl).pullToRefresh({
					down: {
						callback: function() {
							var that = this,
								ul = that.element.querySelector('.mui-table-view');
							setTimeout(function() {
								//self.bnum = 0;
								self.qnum = 0;
								self.cnum = 0;
								self.wnum = 0;
								self.selectflag = true;
								self.getjson(that,ul,"down");
								that.endPullDownToRefresh();
								that.refresh(true);
							}, 1000);
						}
					},
					up: {
						auto:true,
						callback: function() { 
							var that = this;
							var ul = that.element.querySelector('.mui-table-view');
							/*if(self.selectflag){
								self.qnum = 0;
								self.cnum = 0;
								self.wnum = 0;
							}*/
							//获取数据
							setTimeout(function() {
								self.getjson(that,ul,"up");
							},1000);
						}
					}
				});
		});

}


//列表数据获取js
index.fn.prototype.getjson = function(ul,domul,option){
	var self = this,
		url,
		opt;
	switch(domul.getAttribute('data-content')){
		case "question": 
			url = "/Ltdemo/question/list.do";
			opt = {"sindex":self.qnum*10,"lindex":self.qnum*10+10};
			break;
		case "mscontent":
			url = "/Ltdemo/content/list.do";
			opt = {"sindex":self.cnum*10,"lindex":self.cnum*10+10};
			break;
		case "wiki":
			url = "/Ltdemo/wiki/list.do";
			opt = {"sindex":self.wnum*10,"lindex":self.wnum*10+10};
			break;
	}
	util.ajax({ 
		type:"post",
		url:url,
		data:opt,
		success:function(data){
			if(data.success == 1){ 
				if(data.data instanceof Object){
					self.drawquestionlist(data.data,ul,option);
				}else if(data.data == "fail"){
					mui.alert('暂无数据','消息','确定',function (e) {
					   e.index
					},'div')
				}else if(data.data == "null"){
					mui.alert('查询数据没有条数','消息','确定',function (e) {
					   e.index
					},'div')
				}else{
					mui.alert('未知错误','消息','确定',function (e) {
					   e.index
					},'div')
				}
			}else{
				alert("服务器异常")
			}
		}
	})
}


//绘制问题列表
index.fn.prototype.drawquestionlist = function(data,ul,option){
	var self = this,
		arrstr=[];
	switch(data.type){
		case "questions":
			self.drawquestion(data.list,ul,option);
			//if(self.selectflag){}
			self.qnum = (self.qnum+1);
			break;
		case "mscontent":
			self.drawcontent(data.list,ul,option);
			self.cnum = (self.cnum+1);
			break;
		case "wiki":
			self.drawwiki(data.list,ul,option);
			self.wnum = (self.wnum+1); 
			break
	}
}

index.fn.prototype.drawquestion = function(arr,ul,option){
	var self = this,
		arrstr=[];
	for (var i=0; i<arr.length; i++) {
		arrstr.push('<li class="mui-table-view-cell mui-media">')
	        arrstr.push('<a href="javascript:void(0);" class="a-list" data-lstype="question" data-qsid='+arr[i].id+'>')
	            arrstr.push('<div class="mui-media-object mui-pull-left questionbox didanswer">')
	            	arrstr.push('<p class="number">'+ arr[i].tidnum +'</p>') 
	            	arrstr.push('<p>回答</p>')
	            arrstr.push('</div>')
	            arrstr.push('<div class="mui-media-body listmessage">')
	                arrstr.push('<p class="userdate">'+arr[i].username+' · <span class="date">'+util.formatMsgTime(arr[i].creatTime,arr[i].nowDate)+'</span></p>')
	                arrstr.push('<p class="mui-ellipsis">'+arr[i].tittle+'</p>')
	            arrstr.push('</div>')
	        arrstr.push('</a>')
	    arrstr.push('</li>')
	};
	if(option==="up"){
		mui("#scroll1 .qustion-list")[0].innerHTML += arrstr.join("");
		if(arr.length<10){
			ul.endPullUpToRefresh(true);
		}else{
			ul.endPullUpToRefresh(false);
		}
	}else if(option==="down"){
		mui("#scroll1 .qustion-list")[0].innerHTML = arrstr.join(""); 
		if(arr.length<10){
			ul.endPullUpToRefresh(true);
		}else{
			ul.endPullUpToRefresh(false);
		}
	}
}

index.fn.prototype.drawcontent = function(arr,ul,option){ 
	var self = this,
		arrstr=[];
	for (var i=0; i<arr.length; i++) {
		arrstr.push('<li class="mui-table-view-cell a-list" data-lstype="content" data-qsid='+arr[i].id+'>')
	            arrstr.push('<div class="userlogomessage">')
	            	arrstr.push('<img class="mui-media-object mui-pull-left" src="'+arr[i].userimg+'">')
	            	arrstr.push('<p>'+arr[i].author+'</p>')
	            arrstr.push('</div>')
	            arrstr.push('<div class="mui-media-body">')
	                arrstr.push('<p class="title">'+arr[i].title+'</p>')
	                arrstr.push('<p class="mui-ellipsis">'+arr[i].description+'</p>')
	            arrstr.push('</div>')
			    arrstr.push('<p class="zan">')
					arrstr.push('<span> · '+util.formatMsgTime(arr[i].creatTime,arr[i].nowTime)+'</span>')
					arrstr.push('<span> ·  '+arr[i].commenthits+'评论</span>')
				arrstr.push('</p>')
	    arrstr.push('</li>')
	};
	if(option==="up"){
		mui("#scroll2 .mscontent-list")[0].innerHTML += arrstr.join("");
		if(arr.length<10){
			ul.endPullUpToRefresh(true); 
		}else{
			ul.endPullUpToRefresh(false);
		}
	}else if(option==="down"){
		mui("#scroll2 .mscontent-list")[0].innerHTML = arrstr.join(""); 
		if(arr.length<10){
			ul.endPullUpToRefresh(true);
		}else{
			ul.endPullUpToRefresh(false);
		}
	}
}


index.fn.prototype.drawwiki = function(arr,ul,option){ 
	var self = this,
		arrstr=[];

	for (var i=0; i<arr.length; i++) {
		arrstr.push('<li class="mui-table-view-cell mui-media b-list" data-lstype='+arr[i].tittle+' data-qsid='+arr[i].id+'>')
	            arrstr.push('<img class="mui-media-object mui-pull-right" src='+arr[i].images+'>');
	            arrstr.push('<div class="mui-media-body">')	
	            	arrstr.push('<p>'+arr[i].tittle+'</p>')
	            arrstr.push('</div>')
	    arrstr.push('</li>')
	};
	if(option==="up"){ 
		mui("#scroll3 .wiki-list")[0].innerHTML += arrstr.join("");
		if(arr.length<10){
			ul.endPullUpToRefresh(true); 
		}else{
			ul.endPullUpToRefresh(false);
		}
	}else if(option==="down"){
		mui("#scroll3 .wiki-list")[0].innerHTML = arrstr.join(""); 
		if(arr.length<10){
			ul.endPullUpToRefresh(true);
		}else{
			ul.endPullUpToRefresh(false);
		}
	}
}

index.fn.prototype.slide = function(){
	var self = this;
	document.getElementById('slider').addEventListener('slide', function(e) {
		if (e.detail.slideNumber === 1) {
			//self.tabonclick();
		} else if (e.detail.slideNumber === 2) {
			//self.tabonclick();
		}
	});
}
