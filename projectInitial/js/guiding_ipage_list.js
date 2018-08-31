
function loadGuidingTask ($this) {
		$('.guidanceBox').removeClass("yindao_active");
		$($this).addClass("yindao_active");
		autoId = $($this).find(".auto_idBox").html();		
		//引导信息
		$.post("guiding_al/mod4/queryDetailGuidingTask",{autoId:autoId},function(data){
			if(data != null){
				$("#infoBox").empty();
				var html = '<div class="row" style="line-height:23px;"><div class="col-md-3"><span>${_res.guiding_057}：</span><b style="font-size:14px;">'+data.name+'</b></div><div class="col-md-3"><span>${_res.guiding_053}：</span><b style="font-size:14px;">'+data.site+'</b></div><div class="col-md-3"><span>${_res.guiding_055}：</span><b style="font-size:14px;">'
				if(data.type==1){
					html += '${_res.guiding_101}'+data.task+'${_res.guiding_156}';	
				}else if(data.type==2){
					html += '${_res.guiding_100}'+data.task+'${_res.guiding_156}';
				}
				html += '</b></div>';
				html += '<div class="col-md-3"><span>${_res.guiding_170}：</span><b style="font-size:14px;">';
				if(data.status==0){
					//html +='正在进行';
					html +='${_res.guiding_171}';
				}else if(data.status==1){
					//html += '任务结束';
					html += '${_res.guiding_172}';
				}else if(data.status==2){
					//html += '任务完成';
					html += '${_res.guiding_173}';
				}
				html += '</b></div><div class="col-md-3"><span>${_res.guiding_051}：</span><b style="font-size:14px;">'+data.progress+'</b></div></div><div class="row" style="line-height:23px;margin-top:4px;"><div class="col-md-12"><span style="float:left;">${_res.guiding_052}：</span><h2 class="panel-title content clamp-1" style="width:90%;float:left;line-height:21px!important;">'+data.content+'</h2></div></div><div class="row" style="line-height:23px;margin-top:4px;"><div class="col-md-7"><span>${_res.guiding_054}：</span><span style="font-size:14px;">'+data.url+'</span></div><div class="col-md-5"><span>${_res.guiding_056}：</span><span style="font-size:14px;">'+data.explain+'</span></div></div>'
				$("#infoBox").append(html);
			} else {
				$("#infoBox").empty().append('<div style="text-align: center;">${_res.guiding_032}</div>');
			}
		})
		
		//引导详情
		debugger
		var operationType = $($this).find(".operationType").html();
		//if(operationType == "点赞"){
		if(operationType == "${_res.guiding_101}"){
			leadOperationDianzan(autoId)
		//} else if(operationType == "评论"){
		} else if(operationType == "${_res.guiding_100}"){
			leadOperationPinglun();
		}
}
//点赞
function leadOperationDianzan(autoId){
	$.post("guiding_al/mod4/queryLikeTaskResult",{taskId:autoId},function(data){
		if(data.length != 0){
			$("#operationBox").empty();
			$("#operationBox").append('<div style="width:70%;height:30px;background:#fff;position:absolute;top:0%;z-index:99;"></div>') ;
			$("#operationBox").append('<div id="operationBoxDiv" style="margin:-40px 0 0 10%;width:80%;height:1000px;border-left:1px solid #ddd;position:relative;z-index:9;"></div>')
			for(var i=0;i<data.length;i++){
				$("#operationBoxDiv").append('<div style="overflow:hidden;width:100%;height:80px;position:absolute;left:-13px;top:'+(i+1)*80+'px;z-index:999;"><span style="float:left;display:block;width:26px;height:26px;background:#fff;border-radius:50%;border:1px solid #ddd;"></span><b style="display:block;float:left;margin-left:30px;">'+data[i].time+'</b><b style="display:block;float:left;margin-left:30px;">${_res.guiding_101}：'+data[i].num+'</b><b style="display:block;float:left;margin-left:30px;">${_res.guiding_149}：'+data[i].progress+'</b></div>');
			 }
		} else {
			$("#operationBox").html("");
			$("#operationBox").append("<img style='display:block;margin:60px auto 50px auto;' src='/img/my/bt-nodata-now${_home.home_000}.png' />");
		}
	})
}

//评论
function leadOperationPinglun(){
	$("#operationBox").empty();
	var param = get_leadOperation_params();
	var options = new Object();
	options.param = param; 
	options.param["path"] = "/dynamic/guiding_al/mod4/operationInfoList.html"; 
	iPage.page_foot_html = '<div class="page_info ipage-fenye"><div class="ipage-fenye-btn"><button class="startPage page_btn ipage-fenye-on">\u9996\u9875</button><button class="prePage page_btn ipage-fenye-on">\u4e0a\u9875</button><button class="nextPage page_btn ipage-fenye-on">\u4e0b\u9875</button><button class="endPage page_btn ipage-fenye-on" style="display:none;">\u5c3e\u9875</button><input class="pageNo_input" type="text" value="1"/><button class="ipage-fenye-on go_btn">GO</button></div><div class="ipage-fenye-info">\u4fe1\u606f\u603b\u6570\uff1a<span class="ipage-number total"></span>&nbsp;&nbsp;\u603b\u9875\u6570\uff1a<span class="ipage-number totalPage"></span>&nbsp;&nbsp;\u5f53\u524d\u9875\uff1a<span class="ipage-number pageNo"></span></div></div>'; 
	iPage.pageSize = 7; 
	var obj = new iPage.PageLoad("operationBox","guiding_al/mod4/queryReplyTaskResult",options).init();
}
//获取参数
function get_leadOperation_params(){
	var param = {
		taskId:$('.yindao_active').find(".auto_idBox").html()
	}
	return param;
}
