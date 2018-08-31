//绘制微博的有向的传播路径图
function tranPath(container, dataFile,type,bgColor, width,height,chargeNum,callback) {
	this.container =container;	//容器
	this.dataFile = dataFile;			//数据文件路径---改为jsonData对象
	this.width = (width == undefined || width == null ? this.container.width() : width);					//图尺寸
	this.height = (height == undefined || height == null ? this.container.height() : height);					//图尺寸
	this.chargeNum = -100;
	this.gravity = 0;
//	this.flag = flag;
	this.svg = null;
	this.nodes = null;
	this.circle = null;
	this.links = null;
	this.text = null;
	this.scale = 2;						//初始比例
	this.transX = this.width*2/this.scale;			//svg内容偏移
	this.transY = this.height*2/this.scale;			//svg内容偏移
	this.centered; //是否居中
	this.showName = 3;//显示关键节点名字
	this.diff = 1;
	this.filteredData=[];
	
	
	this.maxSize = null;
	this.minSize = null;
	this.st=null
	this.et=null;
	this.clickFlag =false;
	this.filterCnt = 0;//发文量
	this.filterFans = 0;//粉丝数
	this.filterColor=[];//颜色，对应图例的操作
	this.filterSite=[];//站点
	this.filterGroup=[];//节点group
	this.filterSfen=[];//节点身份
	this.filterName=[];//节点名字
	this.filterIDs=[];//过滤节点id
	this.typeStrs = [];//类型
	this.backData = [];
	this.colorType=1;
	this.bgColor = "#1b1b1b";
	this.color =  ["#fef248","#2556f0","#a153f4","#33e539","#ff1321","#0beea7","#ff6833","#ffd74fb","#ff8744","#dafbca"];
	this.stokeColor = "rgb(142,208,232)";
	this.first = false;
	this.graphType=type;//图表类型  大图，小图之类的；
	
	//slide的初始化内容
	this.slideDuration = 500;//ms为单位
	this.autoRewind = false;
	this.playInterval = null;
	this.currentSlide = 0;
	this.fistSlide =0;
	this.lastSlide =null;
	this.isLastPlay = false;
	this.slideInterval = 1;
	this.autoPlay = false;
	this.tmpColor = null;
	this.callback = callback;
	this.toolBar='<div style="z-index:1;">'
	+'<button class="play" style="background:#FDFDFD;border:1px solid #C9C9C9;float:left;margin-top:4px;">Play</button>'
	+'<div class="slider" style="margin-left: 20px;float:left; margin-right: 10px;margin-top: 10px;width:450px"></div></div>'
	+'<p style="color: #fff;position: absolute;top: 36px;z-index: 1; width:400px; text-align:center;margin-left:190px;padding-left:10px;">'
	+'<inpush type="text" class="amount" readonly style="border:0; color:#fff;font-family: fantasy;font-size:20px;color: #E4BFD8;">'
	+'</p>'; 
		this.legend = '<!-- 图例 --><div style="display:block"><div class="descGraph" style="left:50px;position: absolute;top:50px;">'+ 
			'<table>'+
			'<tr><td><div class="bd"><div onclick="showOrNot(this)" style="width:4px;border-radius: 20px;height:0; border-style:solid;border-width:5px;border-color:'+this.color[0]+';opacity:1;overflow:hidden;" class="mtrack-color"/></div></td>'
			+'<td class="name" style="color: #fff;font-size:12px;">达人</td></tr>'
			+'<tr><td><div class="bd"><div onclick="showOrNot(this)" style="width:4px;border-radius: 20px;height:0;border-style:solid;border-width:5px;border-color:'+this.color[1]+';opacity:1;overflow:hidden;" class="mtrack-color"/></div></td>'
			+'<td  class="name" style="color: #fff;font-size:12px;">个人认证</td></tr>'
			+'<tr><td><div class="bd"><div onclick="showOrNot(this)" style="width:4px;border-radius: 20px;height:0;border-style:solid;border-width:5px;border-color:'+this.color[2]+';opacity:1;overflow:hidden;" class="mtrack-color"/></div></td>'
			+'<td class="name" style="color: #fff;font-size:12px;">机构认证</td></tr>'
			+'<tr><td><div class="bd"><div onclick="showOrNot(this)" style="width:4px;border-radius: 20px;height:0;border-style:solid;border-width:5px;border-color:'+this.color[3]+';opacity:1;overflow:hidden;" class="mtrack-color"/></div></td>'
			+'<td class="name" style="color: #fff;font-size:12px;">非认证</td></tr>'	
			+'<tr><td><div class="bd"><div onclick="showOrNot(this)" style="width:4px;border-radius: 20px;height:0;border-style:solid;border-width:5px;border-color:'+this.color[4]+';opacity:1;overflow:hidden;" class="mtrack-color"/></div></td>'
			+'<td class="name" style="color: #fff;font-size:12px;">未知</td></tr>'	
			+'<tr style="display:none"><td><div class="bd" ><div onclick="showOrNot(this)" style="width:4px;border-radius: 20px;height:0;border-style:solid;border-width:5px;border-color:'+this.color[5]+';opacity:1;overflow:hidden;" class="mtrack-color"/></div></td>'
			+'<td class="name" style="color: #fff;font-size:12px;"></td></tr>'	
			+'<tr style="display:none"><td><div class="bd" ><div onclick="showOrNot(this)" style="width:4px;border-radius: 20px;height:0;border-style:solid;border-width:5px;border-color:'+this.color[6]+';opacity:1;overflow:hidden;" class="mtrack-color"/></div></td>'
			+'<td class="name" style="color: #fff;font-size:12px;"></td></tr>'	
			+'</table></div>'
			+'<div id="desc" style="left:40px;position: absolute;top: 240px;">' 
			+'<table style="border-color: #fff;">'
			+'<tr><td lang=1><hr onclick="pathShowOrNot(this)"  size=1 style="color: #fff;border-style:solid;width:50px;margin:6px 0px">  </td>'
			+'<td  style="color: #fff;font-size:12px;">转发关系</td></tr>'
			+'<tr><td lang=2><hr onclick="ShowOrNot2(this)" size=1 style="color: #fff;border-style:dashed ;width:100%;margin:6px 0px"> </td>'
			+'<td  style="color: #fff;font-size:12px;">身份关联</td></tr>'
			+'</table></div></div>';
}
tranPath.prototype.init = function(){
	var obj = this;
	$("#"+obj.container).empty();
	$(obj.toolBar).width($("#"+obj.container).width).insertBefore($("#"+obj.container));
	$("#"+obj.container).append(obj.legend);
	$("#"+obj.container).find(".mtrack-color").each(function(i,n){
		$(n).css("border-color",obj.color[i]);
	});
	obj.genChart();
	obj.play();
	if(obj.autoPlay){
		$(".play").eq(obj.graphType-1).click();
	}
	return obj;
}
 
tranPath.prototype.renderChart = function(dataFile){
	var obj = this;
	$("#"+obj.container).empty();
	obj.dataFile = null;
	obj.dataFile = dataFile;
	obj.genChart();
	return obj;
}

/**是否显示节点，charAt下标从1开始，字符的左边第一位开始，*/
tranPath.prototype.isShow = function(show){
	var obj = this;
	if(show){
		return show.charAt(obj.currentSlide)=="1"?true:false
	}
	return true;
}

/**根据是否显示，更新图*/
tranPath.prototype.updateChartAlongTime = function(){
	var obj = this;
	obj.circle.attr("display",function(d,i){
		if(!obj.isShow(d.show)) 
			return "none";
		else return "block";
	});
	
	obj.path.attr("display",function(d,i){
		if(!obj.isShow(d.source.show)||!obj.isShow(d.target.show))
			return "none";
		else return "block";
	})
	
	obj.text.attr("display",function(d){
		if(!obj.isShow(d.show)) 
			return "none";
		else return "block";
	});
	
	$(".amount").eq(obj.graphType-1).html("当前演化时间："+obj.dataFile.time[obj.currentSlide]+" 时");
	$( ".slider").eq(obj.graphType-1).slider( "value", obj.currentSlide );
}
/**一起更新所有属性过滤*/ 
tranPath.prototype.updateChartForAll = function(){	
	var obj = this;
	obj.filteredData =[];
	obj.circle.attr("display",function(d,i){
		return obj.nodeShowOrNot(d);
	});
	
	obj.path.attr("display",function(d,i){
		return obj.pathShowOrNot(d);
	})
	obj.text.attr("style",function(d){});
	obj.text.attr("display","block");
	obj.text.attr("display",function(d){
		return obj.textShowOrNot(d);
	});
	if(obj.currentSlide>(obj.dataFile.time.length-1)){
		$(".amount").eq(obj.graphType-1).html("");
	}else{
		$(".amount").eq(obj.graphType-1).html("当前演化时间："+obj.dataFile.time[obj.currentSlide]+" 时")
	}
	//console.log("当前slied值"+obj.currentSlide);
	//console.log("时间素组:"+(obj.dataFile.time.length-1));
	$( ".slider").eq(obj.graphType-1).slider( "value", obj.currentSlide );
}


/**path是否显示，单独提取出来，是为了方便点击图例进行颜色过滤的时候，进行path判断*/
tranPath.prototype.pathShowOrNot =function(d){
	var obj=this;
	var t = "";var t_source="";var t_target="";
	if(obj.currentSlide==0){
		t_source=true
		t_target=true;
	}else{
		t_source= obj.isShow(d.source.show)
		t_target= obj.isShow(d.target.show)
	}
 	if(obj.inTimeRange(d.source.show)&&obj.inTimeRange(d.target.show)){//判断时间是否在范围内
		if(obj.sfen(d.source.shenfen)&& obj.sfen(d.target.shenfen) && obj.fans(d.source.fans)&& obj.fans(d.target.fans) &&obj.site(d.source.site)&& obj.site(d.target.site)&&obj.id(d.source.nodeId)&&obj.id(d.target.nodeId)&& obj.name(d.source.name)&& obj.name(d.target.name)&& obj.group(d.source.group)&& obj.group(d.target.group)&&t_source&&t_target && obj.typeStr(d.target.type)&&obj.typeStr(d.source.type)&& obj.cnt(d.source.cnt)&& obj.cnt(d.target.cnt))
			return "block";
		else return "none";
	 }else return "none";
}

/**node是否显示，单独提取出来，是为了方便点击图例进行颜色过滤的时候，进行node判断*/
tranPath.prototype.nodeShowOrNot =function(d){
	var obj = this;
	var s = obj.site(d.site);
	var f = obj.fans(d.fans) ;
	var i =obj.id(d.nodeId) ;
	var n = obj.name(d.name);
	var g =  obj.group(d.group);
	var ty = obj.typeStr(d.type);
	var c = obj.cnt(d.cnt);
	var s = obj.sfen(d.shenfen);
	var t = "";var t_source="";var t_target="";
	if(obj.currentSlide==0){
		t =true;
	}else{
		t=obj.isShow(d.show);
	}
	if(obj.inTimeRange(d.show)){//判断时间是否在范围内
		if( obj.fans(d.fans)  && obj.site(d.site) &&obj.id(d.nodeId) && obj.name(d.name)&& obj.group(d.group)&&t && obj.typeStr(d.type) && obj.cnt(d.cnt) && obj.sfen(d.shenfen)){ //站点，type,fans
			var pushedData= obj.getDealedData(d);
			obj.filteredData.push(pushedData);
			obj.filteredData.sort(Sorts);
			obj.filteredData.reverse();
			return "block";
		}else{ 
			return "none";
		}
	}else return "none";
}


/**text是否显示，单独提取出来，是为了方便点击图例进行颜色过滤的时候，进行text判断*/
tranPath.prototype.textShowOrNot =function(d){
	var obj = this;
	var t = "";
	if(obj.currentSlide==0){
		t =true;
	}else{
		t=obj.isShow(d.show);
	}
	if(obj.inTimeRange(d.show)){//判断时间是否在范围内
		var key = true;
		var s = obj.site(d.site);
		var f = obj.fans(d.fans) ;
		var i =obj.id(d.nodeId) ;
		var n = obj.name(d.name);
		var g =  obj.group(d.group);
		var ty = obj.typeStr(d.type);
		var c = obj.cnt(d.cnt);
		
		var nameOrNot = obj.showNameOrNot(d.keyUser);//是否显示名字；
		if( obj.fans(d.fans) &&  obj.site(d.site)&&obj.id(d.nodeId)&& obj.name(d.name)&& obj.group(d.group)&& t && nameOrNot && obj.typeStr(d.type) && obj.cnt(d.cnt) && obj.sfen(d.shenfen)) //站点，type,fans
			return "block";
		else return "none";
	}else return "none";
}


//对外提供方法
tranPath.prototype.updateShowNameOrNot =function(flag){
	var obj = this;
	if(flag!=null && flag!=""){
		obj.showName = flag;
		obj.updateChartForAll();
	}
}

//判断某个text 是否显示,被updateChartForAll调用
tranPath.prototype.showNameOrNot = function(keyUser){
	var obj = this;
	if(obj.showName==1){
		return true;
	}else if(obj.showName==2){
		return false;
	}else{
		if(keyUser!=null && keyUser!="" && keyUser!="0"){
			return true;
		}else return false;
	}
}

tranPath.prototype.isKeyUser = function(keyUser){
	var obj = this;
	if(obj.showName && keyUser=="1"){
		return true;
	}else return false;
}

tranPath.prototype.group = function(group){
	var obj = this;
	if(obj.compareCircleGroup(group)){
		return true;
	}else return false;
}
tranPath.prototype.sfen = function(sfen){
	var obj = this;
	if(obj.compareCircleSfen(sfen)){
		return true;
	}else return false;
}
tranPath.prototype.id = function(nodeId){
	var obj = this;
	if(obj.compareCircleId(nodeId)){
		return true;
	}else return false;
}
tranPath.prototype.name = function(name){
	var obj = this;
	if(obj.compareCircleName(name)){
		return true;
	}else return false;
}
tranPath.prototype.site = function(site){
	var obj = this;
	if(obj.compareCircleSite(site)){
		return true;
	}else return false;
}
tranPath.prototype.typeStr = function(typeStr){
	var obj = this;
	if(obj.compareCircleType(typeStr)){
		return true;
	}else return false;
}
tranPath.prototype.fans = function(fans){
	var obj = this;
	if(obj.compareCircleFans(fans)){
		return true;
	}else return false;
}
tranPath.prototype.cnt = function(cnt){
	var obj = this;
	if(obj.compareCircleCnt(cnt)){
		return true;
	}else return false;
}
/**时间范围  判断*/
tranPath.prototype.inTimeRange= function(show){
	var obj = this;
	if(obj.fistSlide!=-1){
		if(show){
			for(var i = obj.fistSlide;i<=obj.lastSlide;i++){
				  var t = show.charAt(i);
				  if(t=="1")return true;
			}
			return false;
		}
	}
}
	


/**过滤时间范围*/
tranPath.prototype.setTimeRange= function(st,et){
	var obj= this;
	var len = obj.dataFile.time.length;
	if((st==null ||st=="") && (et==null||et=="")){
		obj.st = obj.dataFile.time[0];
		obj.et = obj.dataFile.time[len-1];
	}else if(st!=null && st!="" && (et==null ||et=="")){
		obj.st = st;
		obj.et = obj.dataFile.time[len-1];
	}else if(et!=null  && et!="" && (st==null ||st=="")){
		obj.st = obj.dataFile.time[0];
		obj.et = et;
	}else{
		obj.st = st;
		obj.et = et;
	}
//	obj.st +=":00:00";
//	obj.et +=":00:00";
//为currentSlide 和lastSlide 赋值
	var first_flag = false;
	var end_flag = false;
	for(var i=0;i<len;i++){
		if(obj.st==obj.dataFile.time[i] && !first_flag){
			obj.fistSlide= i;
			obj.currentSlide = i;
			first_flag = true;
		}if(obj.et==obj.dataFile.time[i] && !end_flag){
			obj.lastSlide = i;
			end_flag=true;
		}	
	}
	if(!first_flag) obj.fistSlide=-1;
}


/**过滤节点，设置不显示的讨论群体输入：*/
tranPath.prototype.setFilterId= function(nodeId){
	var obj = this;
	if(nodeId!=null && nodeId!=""){
		obj.filterIDs = nodeId.split(",");
	}else{
		obj.filterIDs = [];
	}
}

tranPath.prototype.setType = function(typeStr){
	var obj = this;
	if(typeStr!=null && typeStr!=""){
		obj.typeStrs = typeStr.split(",");
	}else{
		obj.typeStrs = [];
	}
}
/**比较节点站点是否为被过滤站点*/
tranPath.prototype.compareCircleId = function(nodeId){
	var obj = this;
	if(nodeId!=undefined && obj.filterIDs.length>0){
		var tag = $.inArray(nodeId, obj.filterIDs); 
		if(tag>=0) return true;
		else return false;
	}else return true;
}
/**过滤节点，设置不显示的讨论群体输入：*/
tranPath.prototype.setFilterName= function(name){
	var obj = this;
	if(name!=null && name!=""){
		obj.filterName = name.split(",");
	}else{
		obj.filterName = [];
	}
}



/**比较节点站点是否为被过滤站点*/
tranPath.prototype.compareCircleName = function(name){
	var obj = this;
	if(name!=undefined && obj.filterName.length>0){
		var tag = -1;
		for(var i=0; i<obj.filterName.length; i++){
			console.info(obj.filterName[i],name);
			if(name.indexOf(obj.filterName[i])!=-1){
				tag = 0;
				break;
			}
		}
		//var tag = $.inArray(name, obj.filterName); 
		if(tag>=0) return true;
		else return false;
	}else return true;
}

/**过滤节点，设置不显示的讨论群体输入：*/
tranPath.prototype.setFilterGroup= function(group){
	var obj = this;
	if(group!=null && group!=""){
		obj.filterGroup = group.split(",");
	}else{
		obj.filterGroup = [];
	}
}
/**过滤节点，设置不显示的讨论群体输入：*/
tranPath.prototype.setFilterSfen= function(sfen){
	var obj = this;
	if(sfen!=null && sfen!=""){
		obj.filterSfen = sfen.split(",");
	}else{
		obj.filterSfen = [];
	}
}

/**比较节点站点是否为被过滤站点*/
tranPath.prototype.compareCircleGroup = function(group){
	var obj = this;
	if(group!=undefined && obj.filterGroup.length>0){
		var groupOfNode= group.split(",");
		for(var i=0;i<groupOfNode.length;i++){
			var tag = $.inArray(groupOfNode[i], obj.filterGroup); 
			if(tag>=0) return true;
		}
		return false;
	}else return true;
}
/**比较节点身份  是否为被过滤站点*/
tranPath.prototype.compareCircleSfen = function(sfen){
	var obj = this;
	if(sfen!=undefined && obj.filterSfen.length>0){
		var sfenOfNode= sfen.split(",");
		for(var i=0;i<sfenOfNode.length;i++){
			var tag = $.inArray(sfenOfNode[i], obj.filterSfen); 
			if(tag>=0) return true;
		}
		return false;
	}else return true;
}
/**过滤节点，设置不显示的站点 输入：1,2,3*/
tranPath.prototype.setFilterSite= function(site){
	var obj = this;
	if(site!=null && site!=""){
		obj.filterSite = site.split(",");
	}else{
		obj.filterSite = [];
	}
}

/**比较节点站点是否为被过滤站点*/
tranPath.prototype.compareCircleSite = function(site){
	var obj = this;
	if(site!=undefined && obj.filterSite.length>0){
		var tag = $.inArray(site, obj.filterSite); 
		if(tag>=0) return true;
		else return false;
	}else {
		return true;
	}
}
/**比较节点类型是否为被过滤站点*/
tranPath.prototype.compareCircleType = function(typStr){
	var obj = this;
	if(typStr!=undefined && obj.typeStrs.length>0){
		var tag = $.inArray(typStr, obj.typeStrs); 
		if(tag>=0) return true;
		else return false;
	}else {
		return true;
	}
}

/**过滤节点，设置不显示的颜色*/
tranPath.prototype.setFilterColor= function(color,flag){
	if(flag==true)
		this.filterColor.push(color);
	else {
		var i = $.inArray(color, this.filterColor);
		if(i>=0)
			this.filterColor.splice(i,1);
	}
}

/**比较节点颜色是否为被过滤颜色*/
tranPath.prototype.compareCircleColor = function(color){
	var obj = this;
	if(color!=undefined){
		var tag = $.inArray(color, obj.filterColor); 
		if(tag>=0) return false;
		else return true;
	}
}
tranPath.prototype.updateChartForFans = function(){
	var obj = this;
	obj.circle.attr("display",function(d,i){
		if(!obj.compareCircleFans(d.fans.toLowerCase().trim())) 
			return "none";
		else return "block";
	});
	
	obj.path.attr("display",function(d,i){
		if(!obj.compareCircleFans(d.source.fans.toLowerCase().trim())||!obj.compareCircleFans(d.target.fans.toLowerCase().trim()))
			return "none";
		else return "block";
	})
	
	obj.text.attr("display",function(d){
		if(!obj.compareCircleFans(d.fans.toLowerCase().trim()))
			return "none";
		else return "block";
	});
}

/**过滤节点，设置最小粉丝数*/ 
tranPath.prototype.setFilterFans = function(d){
	var obj = this;
	if(d!=null && d!=""){
		obj.filterFans = d==null?0:parseInt(d);
	}else{
		obj.filterFans = 0;
	}
}
/**过滤节点，设置最小发文量*/ 
tranPath.prototype.setFilterCnt = function(d){
	var obj = this;
	if(d!=null && d!=""){
		obj.filterCnt = d==null?0:parseInt(d);
	}else{
		obj.filterCnt = 0;
	}
}

tranPath.prototype.compareCircleCnt = function (cnt){
	var obj = this;
	var flag = true;
	if(cnt==undefined || cnt=="")
		cnt = 0;
	var d = parseInt(cnt);
	if (obj.filterCnt !=null && obj.filterCnt <= d){
		flag = true;
	}
	else flag = false;
	return flag;
}
tranPath.prototype.compareCircleFans = function (fans){
	var obj = this;
	var flag = true;
	if(fans==undefined || fans=="")
		fans = 0;
	var d = parseInt(fans);
	if (obj.filterFans !=null && obj.filterFans <= d){
		flag = true;
	}
	else flag = false;
	return flag;
}

/**过滤节点，设置最大最小值*/
tranPath.prototype.setMaxSize = function(d){
	this.maxSize = d==null?null:parseInt(d);
}
tranPath.prototype.setMinSize = function(d){
	this.minSize = d==null?null:parseInt(d);
}
tranPath.prototype.compareCircleSize = function (count){
	var obj = this;
	var flag = true;
	var d = parseInt(count);
	if(count!=undefined){
		if(obj.maxSize ==null &&obj.minSize==null) flag = true; 
		else if (obj.maxSize ==null &&obj.minSize<=d)flag = true;
		else if (obj.minSize ==null &&obj.maxSize>=d)flag = true;
		else if (obj.minSize !=null &&obj.maxSize!=null&&obj.minSize <=d && obj.maxSize >=d)flag = true;
		else flag = false;
	}else {
		flag = true;
	}
	return flag;
}

//拖动slide条的方法
tranPath.prototype.setSlide = function(index){
	var obj = this;
    obj.currentSlide = index;
    $( ".slider" ).eq(obj.graphType-1).slider( "value", index );//添加画图
    obj.updateChartForAll();
}
tranPath.prototype.changeBgColor = function(type){
	var obj = this;
	if(type==1){//黑色
		obj.path.style("stroke","#fff");//修改线的颜色
		obj.text.select("text").transition().duration(10).style("fill","#fff");//修改字体颜色
		$("td.name").attr("style","color:#fff");//修改图例的字体颜色
	}else{//白色
		obj.path.style("stroke","rgb(15, 36, 189)");//修改线的颜色
		obj.text.select("text").transition().duration(10).style("fill", "#000");//修改字体颜色
		$("td.name").attr("style","color:#000");//修改图例的字体颜色
	}
}

/**初始化画图*/
tranPath.prototype.genChart = function(){
	var obj = this;
//	obj.color = d3.scale.ordinal()
//			    .domain(["foo", "bar", "baz"])
//			    .range(["red","yellow","green"]);
	obj.lastSlide = obj.dataFile.time.length;
	//初始化slide
	$( ".slider").eq(obj.graphType-1).slider({
        value: 0,
        min: 0,
        max: obj.dataFile.time.length-1,
        step: 1,
        slide: function( event, ui ) {
            obj.setSlide(ui.value);
        }
	});
	
	//初始化网络图
	obj.svg=null;
	obj.path=null;
	obj.circle=null;
	obj.links = null;
	obj.text = null;
	var div = d3.select("body")
				.append("div")  // declare the tooltip div 
				.attr("class", "tooltip")              // apply the 'tooltip' class
				.style("opacity", 0);    
	// fill = obj.scale//.category20();
	 obj.svg = d3.select("#"+obj.container)  //支持鼠标的拖动，点击
		.append("svg:svg")
		.attr("width", obj.width)
		.attr("height",obj.height)
		.attr("pointer-events", "all")
		.append('svg:g')
	    .call(d3.behavior.zoom().on("zoom", function(){
	    	  obj.svg.attr("transform",
	        	      "translate(" + d3.event.translate + ")"
	        	      + " scale(" + d3.event.scale + ")")
	    }))
	    .on('dblclick.zoom', null)
	    .append('svg:g')
	    
	 obj.svg.append('svg:rect') //平移框,提供放大缩小功能,拖动更轻松
	     .attr('width',obj.width*20 )
	     .attr('height',obj.height*20)
	     .attr('fill', obj.bgColor)
	 	 .attr('opacity','0');
	 	 
    	obj.nodes = obj.dataFile.nodes;
    	obj.links = obj.dataFile.links;
        //得到点之间的距离
        obj.links.forEach(function(link) {
        	link.source = obj.nodes[link.source] || (obj.nodes[link.source] = {name: link.source });
        	link.target = obj.nodes[link.target] || (obj.nodes[link.target] = {name: link.target  });
        });
        var node_total =Object.getOwnPropertyNames(obj.nodes).length ;
        if(node_total<200){
        	obj.chargeNum = -300;
        	obj.gravity = 0.1;
        }else if(node_total<300){
        	obj.chargeNum = -130;
        	obj.gravity = 0.2;
        }else if(node_total<500){ 
        	obj.chargeNum = -100;
        	obj.gravity = 0.2;
        }else if(node_total<1000){
        	obj.chargeNum = -80;
        	obj.gravity = 0.3;
        }else if(node_total<2000){
        	obj.chargeNum = -50;
        	obj.gravity = 0.4;
        }else if(node_total<3000){
        	obj.chargeNum = -40;
        	obj.gravity = 0.45;
        }else if(node_total<4000){
        	obj.chargeNum = -40;
        	obj.gravity = 0.6;
        }else if(node_total<8000){
        	obj.chargeNum = -30;
        	obj.gravity = 0.7;
        }else{
        	obj.chargeNum = -30;
        	obj.gravity = 0.6;
        }
        var force = d3.layout.force()
        			.nodes(d3.values(obj.nodes))
        			.links(obj.links)
        			.size([obj.transX,obj.transY])
        			.linkDistance(20)
        			.gravity(obj.gravity)
        			.friction(0.9)
        			//一会加gravity属性
        			.charge(obj.chargeNum)
        			.on("tick", function(){
        		        obj.path.attr("d",function(d) {
        		            	if(d.source.name==d.source.index)return ;//源节点或者目标节点没有，不显示连线
        		            	if(d.target.name==d.target.index)return ;
        		                var dx = d.target.x - d.source.x,
        		                dy = d.target.y - d.source.y,
        		                dr = Math.sqrt(dx * dx + dy * dy);
        		                return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        		            });
        		            obj.circle.attr("transform",  function(d) {  return "translate(" + d.x + "," + d.y + ")"; });
        		            obj.text.attr("transform",   function(d) { return "translate(" + d.x + "," + d.y + ")";  });
        			}).start();
        	
        	// 为箭头定义类型
		     obj.svg.append("svg:defs")
		        .selectAll("marker")
		        .data(["suit", "licensing", "resolved","tt"])
		        .enter()
		        .append("svg:marker")
		        .attr("id", String)
		        .attr("viewBox", "0 -5 10 10")
		        .attr("refX", 15)
		        .attr("refY", -1.5)
		        .attr("markerWidth", 4)
		        .attr("markerHeight", 4)
		        .attr("markerUnits","userSpaceOnUse")
		        .attr("orient", "auto")
		        .append("svg:path")
		        .attr("d", "M0,-5L10,0L0,5");
		    
        // 处理连线和点元素 
    	obj.path = obj.svg.append('svg:g').selectAll('path');
    	obj.circle = obj.svg.append('svg:g').selectAll('circle');
    	
        //节点间的连线
    	  obj.path =obj.path.data(force.links());
    			obj.path.enter()
        			.append("svg:path")
        			.attr("class",  function(d) {   return "link " + d.type;  })
        			//.attr("style",function(d){return "stroke-width:"+d.size+"px"})
        			.attr("marker-end",  function(d) {  return "url(#" + d.type + ")"; })
        			
        			
        			
        			
        var meizz;//用于鼠标放置在节点上超过一定时间再触发相关事件			
        //节点---分成g,circle层级，就支持点击事件
         obj.circle = obj.circle.data(force.nodes());
     				  obj.circle.enter()
				        .append("g")
				        .attr("class","nodes")
				        .on("click", function (d){
				         	var data =$(this).context.__data__;
				        	var x= 100;var y =100;
				        	var trans = $($(this).context).attr("transform");
				        	var index = trans.indexOf(",");
				        	var x = trans.substring(10,trans.indexOf(","));
				        	var y = trans.substring(trans.indexOf(",")+1,trans.length-1);
				        	x = obj.width/2-x-200;
				        	y = obj.height/2-y-50;
				         	obj.svg.transition().duration(750).attr("transform", "translate(" + x + "," + y + ")");
				         	
					       	d3.select(this).select("text").transition()
					            .duration(750)
					            .attr("x", 22)
					            .style("stroke-width", "50px")
					            .style("font", "40px sans-serif");
					       	 
					        d3.select(this).select("circle").transition()
					            .duration(750)
					            .attr("r",function(d) {  
					            	var nodeId = data.nodeOrderID;
						         	var textNode = $(obj.text[0][nodeId]);//text节点
						         	//console.log(textNode);
					            	var size =$($(this).context).attr("lang");//点击次数
					            	console.log(size,"----------------size")
					            	if(size==1){//第二次点击
					            		if(!obj.showNameOrNot(d.keyUser)){
					            			$(textNode).attr("style","display:none");
					            		}
					            		 $($(this).context).attr("lang","0");//还原标志字段
					            		 if(d.size!="") return  Math.floor(Math.log(data.size+1)+obj.diff);
					            	  		else return 1;
					            	}else{//第一次点击
							         	$(textNode).attr("style","display:block");
					            		$($(this).context).attr("lang","1");//标记标志字段
					            		if(d.size!="") return  Math.floor(Math.log(data.size+1)+obj.diff)*3
					            		else return 5;
					            	}
					            })
					             .style("stroke",function(d) {  
					            	var size =$($(this).context).attr("lang");
					            	if(size==1){//第二次点击
					            		$($(this).context).attr("lang","0");//还原标志字段
					            		  return "pink";
					            	}else{//第一次点击
					            		$($(this).context).attr("lang","1");//标记标志字段
					            		return obj.color[d.site-1] ;
					            	}
					            })
					            .style("stroke-width",function(d) {  
					            	var size =$($(this).context).attr("lang");
					            	if(size==1){//第二次点击
					            		$($(this).context).attr("lang","0");//还原标志字段
					            		return ".5px";
					            	}else{//第一次点击
					            		$($(this).context).attr("lang","1");//标记标志字段
					            		return "5px";
					            	}
					            });
						        var nodeArr= [];
						        var a = {};
						        a.cnt = data.cnt;
				        		a.fans= data.fans;
				        		a.type = data.type;
				        		a.name=  data.name;
				        		a.site=  data.site;
				        		a.group = data.group;
				        		a.shenfen =data.shenfen;
				        		a.nodeOrderID =data.nodeOrderID
				        		a.nodeId =data.nodeId
				        		var newA = obj.getDealedData(a);
				        		//nodeArr.push(newA)
						        obj.links.forEach(function(link) {
						        	if(link.source==data && $.inArray(link.target,nodeArr)<0){
						        		var n = {};
						        		n.cnt = link.target.cnt;
						        		n.fans=link.target.fans;
						        		n.type = link.target.type;
						        		n.name=  link.target.name;
						        		n.site=  link.target.site;
						        		n.group=  link.target.group;
						        		n.shenfen=  link.target.shenfen;
						        		n.nodeOrderID=  link.target.nodeOrderID;
						        		n.nodeId=  link.target.nodeId;
						        		var newN = obj.getDealedData(n);
						        		nodeArr.push(newN)
						        	}if(link.target==data && $.inArray(link.source,nodeArr)<0){
						        		var n = {};
						        		n.cnt = link.source.cnt;
						        		n.fans=link.source.fans;
						        		n.type = link.source.type;
						        		n.name=  link.source.name;
						        		n.site=  link.source.site;
						        		n.group=  link.source.group;
						        		n.shenfen=  link.source.shenfen;
						        		n.nodeOrderID=  link.source.nodeOrderID;
						        		n.nodeId=  link.source.nodeId;
						        		var newN = obj.getDealedData(n);
						        		nodeArr.push(newN);
						        	}
						        });
				        		nodeArr.sort(Sorts);
				        		nodeArr.push(newA);
				        		nodeArr.reverse();
						        obj.backData = JSON.stringify(nodeArr);
						        if(obj.callback){ 
						        	obj.callback(obj.backData); 
						        }
						        obj.backData = data.nodeOrderID;
						        if(obj.callback){ 
						        	obj.callback(obj.backData); 
						        }
				        })
				        /*.on('mouseover', function(d){
				        	div.html("");
				        	var pageX = d3.event.pageX+50;
				        	var pageY = d3.event.pageY - 30;
				        	//请求相关博文
				        	var bloggerId = d.nodeId
				        	var len = 40;
				        	var fawen ="";
				        	var newD = obj.getDealedData(d);
				        	console.log(d);
				        	//	        				var style_str = "<div><div class='tipTitle'><span style='font-weight:bold;'><a style='color: white;'  href='"+d.url+"' target='_blank'>"+d.name+"</a>";
				        	var style_str = "<div name='point_mouseover_show_div'><div class='tipTitle'><span style='font-weight:bold;'>"+d.name;
//				        	var tmp  =style_str +"</span>:<img src='images/close.png'  class='close_my_imgs'  style='cursor:pointer;margin-left: 300px;'></div><div>站点："+newD.site+"&nbsp;&nbsp;&nbsp;粉丝数:"+newD.fans+"&nbsp;&nbsp;&nbsp;认证类型:"+newD.type;
				        	var tmp  =style_str +"</span>:</div><div>站点："+newD.site+"&nbsp;&nbsp;&nbsp;粉丝数:"+newD.fans+"&nbsp;&nbsp;&nbsp;认证类型:"+newD.type;
				        	if(newD.group!=null && newD.group!="")
				        		tmp+="<br>用户群体："+newD.group;
				        	if(newD.shenfen!=null && newD.shenfen!="")
				        		tmp+="<br>用户身份 ："+newD.shenfen;
				        	
				        	
				        	
				        	meizz = setTimeout(function(d){
				        			 div.style("display","block");
						        	 div.html(loadingHtml).transition()
			        					.duration(500)	
			        					.style("opacity", 0)
						        	 .style("left", pageX+ "px")			 
		   					        .style("top", pageY + "px");
		     						 div.html(loadingHtml).transition()
			        					.duration(200)	
			        					.style("opacity", .9)
		     						.style("left", pageX+ "px")			 
		  					        .style("top", pageY + "px");
			        				
			        				if(newD.cnt!="" && newD.cnt!=null && newD.cnt>0){
				        				$.get("json_infoQuery_related_infomation_map_list_forTip.action?eid="+eid+"&data="+bloggerId+"&id="+len,function(d){
				        					 if(d){
				        						 console.log(d);
				        						 var fawen="";
				        						 var data =eval("("+d+")");
				        						 for(var i=0;i<data.length;i++){
				        							 var json = data[i];
				        							 var time=json.time;
				        							 var cnt = json.cnt;
				        							 fawen += "<div id='bowen'><span style='width:98%;'>"+cnt+"</span><br>";
				        							 fawen += "<span class='weibo_date'><span><a href='"+json.url+"' target='_blank'>"+time+"</a></span><span class='weibo_date_title'>&nbsp;&nbsp;&nbsp;来自</span>&nbsp;"+json.site+"</b><span  class='weibo_date2'>转发("+json.rtt+") <img src='images/title_line.png' border='0' /> 评论("+json.cmt+")</span></span></div>";
				        						 }
				        						 tmp +="<br>所发博文<span class='tiaoshu'>"+newD.cnt+"</span>条:<hr>"+fawen;
				        						 tmp+="</div></div></div>";
				        						 div.html(tmp)	 
				        						    .style("left", pageX+ "px")			 
				          					        .style("top", pageY + "px");
				        					 }
				        					 else{
				 	        					tmp+="</div></div>";
						        				div.html(tmp)	 
						        					.style("left", (d3.event.pageX+50) + "px")			 
						        					.style("top", (d3.event.pageY - 30) + "px");
					        				}
				        				});
			        				}else{
			        					tmp+="</div></div>";
				        				div.html(tmp)	 
				        					.style("left", (d3.event.pageX+50) + "px")			 
				        					.style("top", (d3.event.pageY - 30) + "px");
			        				}
	        				
				        	},1500);
				      })
        		  	.on('mouseout', function(d){
        		  		clearTimeout(meizz);
        		 		// div.transition()
     					//.style("opacity", 0);
        		 	})*/
        		 	 div.on('mouseover', function(){
        		 		div.transition()
        		 		.style("opacity", .9);
        		 	}).on('mouseout', function(){
        		 		div.style("display","none");
	    		 		 div.transition()
	 					.style("opacity", 0);
        		 	})
        		 	
	        obj.circle.append('circle')
	        			.attr('r', function(d) { 
	        				if(d.size!=null &&d.size!="")
	        				return Math.floor(Math.log(d.size+1)+obj.diff);
	        				else return obj.diff;
	        			}) //节点大小
	        			.style('fill', function(d) {
	        				return obj.color[d.type-1] }) //内部颜色
	        			.style('stroke', obj.stokeColor)//function(d) { return obj.color[d.site-1]}) //边框颜色
	        			  .style("stroke-width","1px");
	        			
		     obj.circle.append('title')
				        .text(function(d){
				        	if(obj.container == "bozhu_shehuifenxi") {
				        		return d.name;
							} else {
								return d.name;
//				        		return d.content;
				        	}
				        });
        obj.text = obj.svg.append("svg:g")
        			  .selectAll("g")
        			  .data(force.nodes())
        			  .enter()
        			  .append("svg:g");
        
        obj.text.append("svg:text")
	        .attr("x", -30)
	        .attr("y", -10)
	        .attr("class", "shadow")
	        .text(function(d) {
	        	if(d.name!=d.index){
	        	 	return d.name;
	        	}
	        })
        obj.text.attr("display",function(d){
    		var nameOrNot = obj.showNameOrNot(d.keyUser);
    		if(nameOrNot) //站点，type,fans
    			return "block";
    		else return "none";
    	});
       
        for(var i=0;i<force.nodes().length;i++){
        	obj.filteredData.push(obj.getDealedData(force.nodes()[i]));
        }
		obj.filteredData.sort(Sorts);
		obj.filteredData.reverse();
}

/*$(".close_my_imgs").unbind("click").click(function(){
	console.log(111)
	 div.html("").transition()
		.style("opacity", 0);
});*/

tranPath.prototype.updateColor = function(type){
	var obj =  this;
	obj.colorType = type;
	obj.circle.select("circle").transition().duration(100).style('fill', function(d) {
		return obj.getColorValue(d);
	});
}
tranPath.prototype.getColorValue = function(d){
	var obj = this;
	var type = obj.colorType;
	if(type==1){
		return obj.color[d.type-1]; 
	}else if(type==2){
		var group = d.group;
		if(d.group.indexOf(",")!=-1)
			group = d.group.split(",")[0];
		return obj.color[group-1];
	}else if(type==3){
		var sf = d.shenfen;
		if(d.shenfen.indexOf(",")!=-1)
			sf = d.shenfen.split(",")[0];
		return obj.color[sf-1]; 
	}else if(type==4){
		return obj.color[d.tl-1] ;
	}else if(type==5)
		return obj.color[d.site-1] ;
}

function  Sorts(a,b){
	var t1 =a.cnt;
	var t2 = b.cnt;
	if(t1.indexOf("万")!=-1) t1=t1.substring(0,t1.length-1)*10000;
	if(t2.indexOf("万")!=-1) t2=t2.substring(0,t2.length-1)*10000;
	if(t1=="--")t1=0;
	if(t2=="--")t2=0;
	var dis = t1-t2;
	if(dis==0){
		var s1 =a.fans;
		var s2 = b.fans;
		if(s1.indexOf("万")!=-1) s1=s1.substring(0,s1.length-1)*10000;
		if(s2.indexOf("万")!=-1) s2=s2.substring(0,s2.length-1)*10000;
		if(s1=="--")s1=0;
		if(s2=="--")s2=0;
		return s1-s2;
	}else
		return t1-t2;
}
tranPath.prototype.getDealedData = function(d){
	 var newD = {};
	 var group = d.group;
	 var gv = "";
	 if(group.indexOf("1")>-1)gv+="第一落点人,";
	 if(group.indexOf("2")>-1)gv+="核心博主,";
	 if(group.indexOf("3")>-1)gv+="网络推手,";
	 
	 var sfen = d.shenfen;
	 var gv2 = "";
	 if(sfen.indexOf("1")>-1)gv2+="律师,";
	 if(sfen.indexOf("2")>-1)gv2+="警察,";
	 if(sfen.indexOf("3")>-1)gv2+="媒体从业者,";
	 if(sfen.indexOf("4")>-1)gv2+="政府官员,";
	 if(gv.indexOf(",")>-1)
		 gv = gv.substring(0,gv.length-1);
	 if(gv2.indexOf(",")>-1)
		 gv2 = gv2.substring(0,gv2.length-1);
	 
	 
	var type= d.type;
	if(type==1)type="达人";
	else if(type==2) type="个人认证";
	else if(type==3) type="机构认证";
	else if(type==4) type="非认证";
	else type="--";
	
	var cnt = d.cnt;
	if(cnt!=null && cnt!="0"&& (cnt/10000)>1){
		cnt = cnt/10000+"万";
	} else if(cnt==""||cnt==0)
		cnt = "--"
	
	var fans = d.fans;
	if(fans!=null && fans!="0"&&(fans/10000)>1){
		fans = Math.round(fans/10000)+"万";
	} else if(fans==""|| fans==0)
		fans = "--";
	var site =d.site;
	if(site=="1"){
		site = "新浪微博";
	}else if(site=="2")
		site="腾讯微博";
	else if(site=="3")
		site="搜狐微博";
	else  if(site=="4")
		site="网易微博";
	else if(site=="5")
		site="Twitter"
	else if(site=="6")
		site="凤凰微博";
	else if(site=="7")
		site="人民微博";
	 newD.site = site;
	 newD.name = d.name;
	 newD.nodeOrderID = d.nodeOrderID;
	 newD.nodeId = d.nodeId;
	 newD.group = gv;
	 newD.fans = fans;
	 newD.cnt = cnt;
	 newD.type = type;
	 newD.shenfen = gv2;
	 return newD;
}

tranPath.prototype.play = function(){
	var obj = this;
	 $( ".play" ).eq(obj.graphType-1).button({
	      icons: {
	        primary: "ui-icon-play"
	      },
	      text: false
	    }).click(function () {
	    	//edit by lld
	    	 if($(".amount").is(":hidden")){
	    	     	$(".amount").show();
	    	     }
	    		
	    	//
	    	obj.isLastPlay = false;
	        if (obj.playInterval != undefined) {
	           clearInterval(obj.playInterval);
	           obj.playInterval = undefined;
	            $(this).button({
	                icons: {
	                    primary: "ui-icon-play"
	                }
	            });
	            return;
	        }
	        $(this).button({
	            icons: {
	                primary: "ui-icon-pause"
	            }
	        });
	        obj.playInterval = setInterval(function () {
	            obj.currentSlide += parseInt(obj.slideInterval);
	            console.log(obj.currentSlide);
	            console.log(obj.lastSlide);
	            if (obj.currentSlide > obj.lastSlide && obj.isLastPlay) {//播放过
	                if (obj.autoRewind) {
	                    obj.currentSlide = obj.fistSlide;
	                }else {
	                	obj.currentSlide = obj.fistSlide;
	                	$(".play").eq(obj.graphType-1).button().click();
	                  //  return;
	                }
	            }else if(obj.currentSlide >= obj.lastSlide && !obj.isLastPlay){//播放过
	            	obj.currentSlide =obj.fistSlide;
	            	obj.isLastPlay = true;
	            	$(".play").eq(obj.graphType-1).button().click();
	            }
	            obj.updateChartForAll();
	        }, obj.slideDuration);
	    });
	
}

//设置不同的播放 粒度，供外面调用
tranPath.prototype.setSlideInterval = function(i){
	var obj = this;
	if(i>0 && i!=null && i!=""){
		obj.slideInterval = i;
		obj.currentSlide = obj.fistSlide;
		obj.setSlide(obj.fistSlide);
		$( ".play" ).eq(obj.graphType-1).button().click();
	}
}
tranPath.prototype.updateData = function(jsonData){
	var obj = this;
	if(obj.dataFile==jsonData){
		return ;
	}else{
		obj.renderChart(jsonData);
	}
}

//统一过滤数组；
tranPath.prototype.setFilterArray= function(arr,para){
	var obj = this;
	if(para!=null && para!=""){
		arr = para.split(",");
	}else{
		arr = [];
	}
}
tranPath.prototype.getFcount = function(nodeOrderID1,nodeOrderID2){
	var fcount = "";
	var obj = this;
	 obj.links.forEach(function(link) {
     	if((link.source.nodeOrderID==nodeOrderID1 && link.target.nodeOrderID==nodeOrderID2)|| (link.source.nodeOrderID==nodeOrderID2 && link.target.nodeOrderID==nodeOrderID1)){
     		fcount += link.fcount.substring(1,link.fcount.length-1)+",";
     	} 
     });
	 if(fcount.indexOf(",")!=-1)
		 fcount = fcount.substring(0,fcount.length-1);
	 return fcount;
}

tranPath.prototype.paraFilter = function(opt,obj){
	var obj = this;
	if(opt!=null){
		var site = opt.site;
		var group = opt.group;
		var name= opt.name;
		var id = opt.id;
		var fans = opt.fans;
		var typeStr = opt.type;
		var cnt = opt.cnt;
		var sfen =opt.sfen;
		var stime =opt.st;
		var etime = opt.et;
	 	obj.setFilterSite(site);
		obj.setFilterFans(fans);
		obj.setFilterCnt(cnt);
		obj.setFilterName(name);
		obj.setFilterGroup(group);
		obj.setFilterSfen(sfen);
		obj.setFilterId(id);
		obj.setType(typeStr);
		if(stime!=null || etime!=null){
			obj.setTimeRange(stime,etime);
		}
		obj.updateChartForAll();
	}
}
/**更新图*/
tranPath.prototype.updateChartForColor = function(){
	var obj = this;
	obj.circle.attr("display",function(d,i){
		var _color = obj.getColorValue(d);
		if(!obj.compareCircleColor(_color.toLowerCase().trim())) 
			return "none";
		else return obj.nodeShowOrNot(d);
	});
	
	obj.path.attr("display",function(d,i){
		if(!obj.compareCircleColor(obj.getColorValue(d.source).toLowerCase().trim())||!obj.compareCircleColor(obj.getColorValue(d.target).toLowerCase().trim()))
			return "none";
		else return obj.pathShowOrNot(d);
	})
	
	obj.text.attr("display",function(d){
		if(!obj.compareCircleColor(obj.getColorValue(d).toLowerCase().trim()))
			return "none";
		else{
		 return obj.textShowOrNot(d);
		}
	});
}
function show1(flag) {  //显示博主名称
	if (flag) {
		$(".showAllBloggerName").text("还原");
		$(".showAllBloggerName").attr("href", "javascript:show1(false)");
	} else {
		$(".showAllBloggerName").text("显示部分博主");
		$(".showAllBloggerName").attr("href", "javascript:show1(true)");
	}
	t = new tranPath("contain", "gao.json", 1000, 700, -100, flag).init();
}
function showSizeFilter() {  //可用
	var maxSize = 200;
	var minSize = 100;
	t.setMaxSize(null);
	t.setMinSize(3);
	t.updateChartForColor();
}

function colorFilter(color,flag) {
	graph_now.setFilterColor(color,flag);
	graph_now.updateChartForColor();
}

function siteFilter(site) {
	t.setFilterSite(site);
	t.updateChartForSite();
}
 
function fansFilter(filterFans){
	t.setFilterFans(filterFans);
	t.updateChartForFans();
}

function showOrNot2(h){
	var type=$(h).parent().attr("lang");
	if(type==1){//隐藏实线
		var obj = this;
		obj.circle.attr("display",function(d,i){
			var _color = obj.getColorValue(d);
			if(!obj.compareCircleColor(_color.toLowerCase().trim())) 
				return "none";
			else return obj.nodeShowOrNot(d);
		});
		
		obj.path.attr("display",function(d,i){
			if(!obj.compareCircleColor(obj.getColorValue(d.source).toLowerCase().trim())||!obj.compareCircleColor(obj.getColorValue(d.target).toLowerCase().trim()))
				return "none";
			else return obj.pathShowOrNot(d);
		})
		
		obj.text.attr("display",function(d){
			if(!obj.compareCircleColor(obj.getColorValue(d).toLowerCase().trim()))
				return "none";
			else{
			 return obj.textShowOrNot(d);
			}
		});
	
	}else {//隐藏虚线
	
	
	}
	
}

//图例的用户交互操作
function showOrNot(h){
	var  color = $(h).css("border-color");
	if(color.indexOf("rgb")!=-1){
		var tmpColor  =[];
		tmpColor  = color.replace("rgb(","").replace(")","").split(",");
		var r = tmpColor[0];
		var g = tmpColor[1];
		var b = tmpColor[2];
		color  = "#"+rgbToHex(r,g,b);
	}
	var  opacity = $(h).css("opacity");
	 if(opacity<1){
		colorFilter(color.toLowerCase(),false);
		$(h).css("opacity","1");
	}else {
		colorFilter(color.toLowerCase(),true);
		 $(h).css("opacity","0.1");
	}
}
function rgbToHex(r, g, b) { return ((r << 16) | (g << 8) | b).toString(16); } 
