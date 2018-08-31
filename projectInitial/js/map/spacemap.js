//绘制微博的有向的传播路径图
function spacemap(container,mapFile,mapId,jsonData, width, height,callback) {
	this.container =container;	// 容器
	this.time = jsonData.time;       // 时间数组
	this.nodes = jsonData.nodes; // 具体数据
	this.width = (width == undefined || width == null ? this.container.width() : width);					// 图尺寸
	this.height = (height == undefined || height == null ? this.container.height() : height);					// 图尺寸
	this.callback = callback;
	this.mapId = mapId;
	this.mapFile = mapFile;
	this.myMap = null;
	this.minColor = "87CEFA";
	this.middleColr = "FCFE05";
	this.maxColor ="FF4500";
	this.hoverColor = "FCFE05";
	this.mapTitle = '{"bgColor":"ffffff","borderColor":"ffffff","fillColor":"'+this.minColor+'","includeValueInLabels":"0","unescapeLinks":"0","animation": "0", "showbevel": "0", "usehovercolor": "1", "canvasbordercolor": "FFFFFF", "bordercolor": "FFFFFF","legendBgColor":"ffffff","legendBgAlpha":"50", "showlegend": "1", "showshadow": "0", "legendposition": "BOTTOM", "legendborderalpha": "1", "legendbordercolor": "red", "legendallowdrag": "0", "legendshadow": "0", "caption": "", "connectorcolor": "000000", "fillalpha": "100", "hovercolor": "'+this.hoverColor+'", "showborder": 0}';
	this.mapColorRange = '{ "minvalue": "0", "startlabel": "低",  "endlabel": "高","code": "'+this.minColor+'","gradient": "1","color": [{ "maxvalue": "30000",  "displayvalue": "",  "code": "'+this.middleColr+'"},{ "maxvalue": "100000", "code": "'+this.maxColor+'"}]}';
	this.entityDef = [{"internalId":"CN.AH","lName":"安徽","newId":"安徽","sName":"安徽"},{"internalId":"CN.BJ","lName":"北京","newId":"北京","sName":"北京"},{"internalId":"CN.CQ","lName":"渝","newId":"渝","sName":"渝"},{"internalId":"CN.FJ","lName":"福建","newId":"福建","sName":"福建"},{"internalId":"CN.GS","lName":"甘肃","newId":"甘肃","sName":"甘肃"},{"internalId":"CN.GD","lName":"广东","newId":"广东","sName":"广东"},{"internalId":"CN.GX","lName":"广西","newId":"广西","sName":"广西"},{"internalId":"CN.GZ","lName":"贵州","newId":"贵州","sName":"贵州"},{"internalId":"CN.HA","lName":"海南","newId":"海南","sName":"海南"},{"internalId":"CN.HB","lName":"河北","newId":"河北","sName":"河北"},{"internalId":"CN.HE","lName":"河南","newId":"河南","sName":"河南"},{"internalId":"CN.HU","lName":"湖北","newId":"湖北","sName":"湖北"},{"internalId":"CN.HL","lName":"黑龙江","newId":"黑龙江","sName":"黑龙江"},{"internalId":"CN.HN","lName":"湖南","newId":"湖南","sName":"湖南"},{"internalId":"CN.JS","lName":"江苏","newId":"江苏","sName":"江苏"},{"internalId":"CN.JX","lName":"江西","newId":"江西","sName":"江西"},{"internalId":"CN.JL","lName":"吉林","newId":"吉林","sName":"吉林"},{"internalId":"CN.LN","lName":"辽宁","newId":"辽宁","sName":"辽宁"},{"internalId":"CN.NM","lName":"内蒙古","newId":"内蒙古","sName":"内蒙古"},{"internalId":"CN.NX","lName":"宁夏","newId":"宁夏","sName":"宁夏"},{"internalId":"CN.QH","lName":"青海","newId":"青海","sName":"青海"},{"internalId":"CN.SA","lName":"陕西","newId":"陕西","sName":"陕西"},{"internalId":"CN.SD","lName":"山东","newId":"山东","sName":"山东"},{"internalId":"CN.SH","lName":"上海","newId":"上海","sName":"上海"},{"internalId":"CN.SX","lName":"山西","newId":"山西","sName":"山西"},{"internalId":"CN.SC","lName":"四川","newId":"四川","sName":"四川"},{"internalId":"CN.TJ","lName":"天津","newId":"天津","sName":"天津"},{"internalId":"CN.XJ","lName":"新疆","newId":"新疆","sName":"新疆"},{"internalId":"CN.XZ","lName":"西藏","newId":"西藏","sName":"西藏"},{"internalId":"CN.YN","lName":"云南","newId":"云南","sName":"云南"},{"internalId":"CN.ZJ","lName":"浙江","newId":"浙江","sName":"浙江"},{"internalId":"CN.MA","lName":"澳门","newId":"澳门","sName":"澳门"},{"internalId":"CN.HK","lName":"香港","newId":"香港","sName":"香港"},{"internalId":"CN.TA","lName":"台湾","newId":"台湾","sName":"台湾"}];
	this.mapData = null;// map 绘图时需要的数据
	this.mapValue = []; // map的统计出来的数据对应的值
	this.area=[];
	this.max= 0 ;
	this.min= 0;
	this.isStart = 0;
	
	// 过滤条件
	this.filterFans = 0;// 粉丝数
	this.filterSite=[];// 站点
	this.filterGroup=[];// 群组
	this.filterName=[];// 名字
	this.filterIDs=[];// id，与关键词的过滤对应
	this.backData = null;// 返回给前台页面的点击数据；
	this.filterCnt = 0;//发文量
	this.filterSfen=[];//节点身份
	this.typeStrs = [];//类型
	
	// slide的初始化内容
	this.slideDuration = 1000;// ms为单位
	this.autoRewind = true;
	this.playInterval = null;
	this.currentSlide = 0;
	this.autoPlay = false;
	this.tmpColor = null;
	this.toolBar='<div style="margin-top:100px;display:none;">'
		+'<p><label for="amount">时间:</label>'
		+'<inpush type="text" id="amount" readonly style="border:0; color:#f6931f; font-weight:bold;">'
		+'</p>'
		+'<button id="play" style="display:none">Play</button>'
		+'<div id="slider" style="margin-left: 50px; margin-right: 10px;width:600px;display:none"></div></div>';
	this.entityDefName = [];//地图所有省份
}
spacemap.prototype.renderChart = function(jsonData){
	var obj = this;
	$("#"+obj.container).empty();
	obj.nodes = jsonData.nodes;
	obj.time = jsonData.time;
	obj.myMap.debugMode.enabled(console.log, 'verbose');
	obj.getMapDataReady();
	obj.myMap.setJSONData(obj.mapData);
	obj.myMap.render(obj.container);
	
	return obj;
}

spacemap.prototype.init = function(){
	var obj = this;
	$("#"+obj.container).empty();
	$(obj.toolBar).width($("#"+obj.container).width).insertAfter($("#"+obj.container));
	obj.genChart();
	obj.play();
	if(obj.autoPlay){
		$("#play").click();
	}
	return obj;
}

// 准备地图数据，每次画图前都需要重新准备；
spacemap.prototype.getMapDataReady = function(){
	var obj = this;
	obj.mapValue = [];
	obj.area=[];
	// 对数据进行过滤，生成map的数据结构，然后绘图；
	 var isShow="";
	obj.getEntityDefName();
	for(var id in obj.nodes){
		  var d = obj.nodes[id];
		  if(obj.currentSlide==0){
		     isShow = true;
		  }else{
			  isShow = obj.isShow(d.show);
		  }
		  var fans=obj.fans(d.fans);
		  var nodeId = obj.id(d.nodeId);
		  var site = obj.site(d.site);
		  var name = obj.name(d.name);
		  var group = obj.group(d.group);
		  var type = obj.typeStr(d.type);
		  var cnt = obj.cnt(d.cnt);
		  var sfen = obj.sfen(d.shenfen);
		// var isShow = obj.isShow(d.show)
		  var tag = fans && nodeId && site && name && group && isShow && sfen && cnt && type;
			if(tag){ // 站点，type,fans
				var area = d.area;
				if(area!=null && area!="" && area!="其他"){
					if((obj.mapValue==null ||obj.mapValue.length==0)|| $.inArray(area, obj.area)<0){
						var tmp = {"id":area,"value":1,"link":"j-mapClick-"+area+","+obj.currentSlide};
						obj.area.push(area);
						obj.mapValue.push(tmp);
					}else{
						for(var i=0;i<obj.mapValue.length;i++){
							var mapObj= obj.mapValue[i];
							 if(mapObj.id==area){
								 mapObj.value ++;
							 }
						}
					}
				}
			}
	}
	//--JGR 给所有为0的元素添加点击事件 start
	for(var i=0;i<obj.area.length;i++){
		obj.entityDefName.removeByValue(obj.area[i]);
	}
	for(var i=0;i<obj.entityDefName.length;i++){
		var area = obj.entityDefName[i];
		var tmp = {"id":area,"value":0,"link":"j-mapClick-"+area+","+"0"};
		obj.area.push(area);
		obj.mapValue.push(tmp);
	}
	//-- end
	for(var i=0;i<obj.mapValue.length;i++){
		var mapObj= obj.mapValue[i];
		if(obj.max<mapObj.value){
			obj.max = mapObj.value;
		}if(obj.min>mapObj.value){
			obj.min = mapObj.value;
		}
	}
	if (obj.max==0){
		obj.max==10;
	}
	// console.log(obj.mapValue);
	obj.myMap = FusionCharts(obj.mapId);
	var mapColorRange = JSON.parse(obj.mapColorRange);
	mapColorRange.minValue = obj.min;
	mapColorRange.color[0].maxvalue= (obj.max-obj.min)/2;
	mapColorRange.color[1].maxvalue= obj.max;
	
	var re = '{"map":'+ obj.mapTitle +',"entityDef":'+JSON.stringify( obj.entityDef)+',"colorrange":' +JSON.stringify(mapColorRange) +',"data":'+JSON.stringify( obj.mapValue)+'}';
	obj.mapData = JSON.parse(re);
}

/** 是否显示节点，charAt下标从1开始，字符的左边第一位开始， */
spacemap.prototype.isShow = function(show){
	var obj = this;
	if(show){
		return show.charAt(obj.currentSlide)=="1"?true:false
	}
	return true;
}

// 得到返回的数据；
spacemap.prototype.getBackData = function(tmp){
	var obj = this;
	var data =[];
	data = tmp.split(",");
	var area = data[0];//点击区域
	var index = data[1];//点击的时间数组下标1
	var clickTime = obj.time[index];//有序号，转化出来的点击时间
	var result="";
	var nodeId="";
	var nodes = obj.mapData;
	for(var id in nodes){
		 var d = nodes[id];
		 if(area==d.area){
			 var nodeOrderID = d.nodeOrderID;
			 result += nodeOrderID+",";
			 nodeId += d.nodeId+",";
		 }
	}
	if(result!=null && result!=""){
		result = result.substring(0,result.length-1);
	}
	if(nodeId!=null && nodeId!=""){
		nodeId = nodeId.substring(0,nodeId.length-1);
	}
	//result +="="+nodeId;  //地区=该地区的NodeId;
	//result +="="+clickTime;  //地区=该地区的NodeId;
	result = area+"="+clickTime;
//	result.push(clickTime);
	map.backData = result;
}

spacemap.prototype.updateMapForAll = function(){
	var obj = this;
	obj.getMapDataReady();
	obj.myMap.setJSONData(obj.mapData);
	$("#amount").html(obj.time[obj.currentSlide]);
	$( "#slider").slider( "value", obj.currentSlide );
} 



spacemap.prototype.group = function(group){
	var obj = this;
	if(obj.compareCircleGroup(group)){
		return true;
	}else return false;
}
spacemap.prototype.id = function(nodeId){
	var obj = this;
	if(obj.compareCircleId(nodeId)){
		return true;
	}else return false;
}
spacemap.prototype.name = function(name){
	var obj = this;
	if(obj.compareCircleName(name)){
		return true;
	}else return false;
}
spacemap.prototype.site = function(site){
	var obj = this;
	if(obj.compareCircleSite(site)){
		return true;
	}else return false;
}
spacemap.prototype.fans = function(fans){
	var obj = this;
	if(obj.compareCircleFans(fans)){
		return true;
	}else return false;
}
spacemap.prototype.sfen = function(sfen){
	var obj = this;
	if(obj.compareCircleSfen(sfen)){
		return true;
	}else return false;
}
spacemap.prototype.typeStr = function(typeStr){
	var obj = this;
	if(obj.compareCircleType(typeStr)){
		return true;
	}else return false;
}
spacemap.prototype.cnt = function(cnt){
	var obj = this;
	if(obj.compareCircleCnt(cnt)){
		return true;
	}else return false;
}

/** 过滤节点，设置不显示的群组输入： */
spacemap.prototype.setFilterId= function(nodeId){
	var obj = this;
	if(nodeId!=null && nodeId!=""){
		obj.filterIDs = nodeId.split(",");
	}else{
		obj.filterIDs = [];
	}
}

/** 比较节点站点是否为被过滤站点 */
spacemap.prototype.compareCircleId = function(nodeId){
	var obj = this;
	if(nodeId!=undefined && obj.filterIDs.length>0){
		var tag = $.inArray(nodeId, obj.filterIDs); 
		if(tag>=0) return true;
		else return false;
	}else return true;
}
/** 过滤节点，设置不显示的群组输入： */
spacemap.prototype.setFilterName= function(name){
	var obj = this;
	if(name!=null && name!=""){
		obj.filterName = name.split(",");
	}else{
		obj.filterName = [];
	}
}

/** 比较节点站点是否为被过滤站点 */
spacemap.prototype.compareCircleName = function(name){
	var obj = this;
	if(name!=undefined && obj.filterName.length>0){
		//JGR 修改为模糊匹配
		if(name.match(obj.filterName)!=null){
			return true;
		}
		var tag = $.inArray(name, obj.filterName); 
		if(tag>=0) return true;
		else return false;
	}else return true;
}

/** 过滤节点，设置不显示的群组输入： */
spacemap.prototype.setFilterGroup= function(group){
	var obj = this;
	if(group!=null && group!=""){
		obj.filterGroup = group.split(",");
	}else{
		obj.filterGroup = [];
	}
}

/** 比较节点站点是否为被过滤站点 */
spacemap.prototype.compareCircleGroup = function(group){
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
/** 过滤节点，设置不显示的站点 输入：1,2,3 */
spacemap.prototype.setFilterSite= function(site){
	var obj = this;
	if(site!=null && site!=""){
		obj.filterSite = site.split(",");
	}else{
		obj.filterSite = [];
	}
}

/** 比较节点站点是否为被过滤站点 */
spacemap.prototype.compareCircleSite = function(site){
	var obj = this;
	if(site!=undefined && obj.filterSite.length>0){
		var tag = $.inArray(site, obj.filterSite); 
		if(tag>=0) return true;
		else return false;
	}else {
		return true;
	}
}

/** 过滤节点，设置不显示的颜色 */
spacemap.prototype.setFilterColor= function(color,flag){
	if(flag==true)
		this.filterColor.push(color);
	else {
		var i = $.inArray(color, this.filterColor);
		if(i>=0)
			this.filterColor.splice(i,1);
	}
}

/** 比较节点颜色是否为被过滤颜色 */
spacemap.prototype.compareCircleColor = function(color){
	var obj = this;
	if(color!=undefined){
		var tag = $.inArray(color, obj.filterColor); 
		if(tag>=0) return false;
		else return true;
	}
}
/** 过滤节点，设置最小粉丝数 */ 
spacemap.prototype.setFilterFans = function(d){
	var obj = this;
	if(d!=null && d!=""){
		obj.filterFans = d==null?null:parseInt(d);
	}else{
		obj.filterFans = 0;
	}
	}
spacemap.prototype.compareCircleFans = function (fans){
	var obj = this;
	var flag = true;
	var d = parseInt(fans);
	if(fans!=undefined){
		if (obj.filterFans !=null && obj.filterFans <= d){
			flag = true;
		}
		else flag = false;
	}else {
		flag = true;
	}
	return flag;
}
/**过滤节点，设置最小发文量*/ 
spacemap.prototype.setFilterCnt = function(d){
	var obj = this;
	if(d!=null && d!=""){
		obj.filterCnt = d==null?0:parseInt(d);
	}else{
		obj.filterCnt = 0;
	}
}

spacemap.prototype.compareCircleCnt = function (cnt){
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

spacemap.prototype.setType = function(typeStr){
	var obj = this;
	if(typeStr!=null && typeStr!=""){
		obj.typeStrs = typeStr.split(",");
	}else{
		obj.typeStrs = [];
	}
}
/**比较节点类型是否为被过滤站点*/
spacemap.prototype.compareCircleType = function(typStr){
	var obj = this;
	if(typStr!=undefined && obj.typeStrs.length>0){
		var tag = $.inArray(typStr, obj.typeStrs); 
		if(tag>=0) return true;
		else return false;
	}else {
		return true;
	}
}
/**比较节点身份  是否为被过滤站点*/
spacemap.prototype.compareCircleSfen = function(sfen){
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
/**过滤节点，设置不显示的讨论群体输入：*/
spacemap.prototype.setFilterSfen= function(sfen){
	var obj = this;
	if(sfen!=null && sfen!=""){
		obj.filterSfen = sfen.split(",");
	}else{
		obj.filterSfen = [];
	}
}

/** 初始化画图 */
spacemap.prototype.genChart = function(){
	var obj = this;
	// 初始化slide
	$( "#slider").slider({
        value: 0,
        min: 0,
        max: obj.time.length-1,
        step: 1,
        slide: function( event, ui ) {
            obj.setSlide(ui.value);
        }
	});
	obj.getMapDataReady();
	
	obj.myMap = new FusionCharts(obj.mapFile, obj.mapId, obj.width, obj.height, "0");
	obj.myMap.setJSONData(obj.mapData);
	obj.myMap.render(obj.container);
	
}

// slide的播放动作
spacemap.prototype.play = function(){
	var obj = this;
	 $( "#play").button({
	      icons: {
	        primary: "ui-icon-play"
	      },
	      text: false
	    }).click(function () {
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
	            obj.currentSlide++;
	            if (obj.currentSlide >= obj.time.length) {
	                if (obj.autoRewind) {
	                    obj.currentSlide = 0;
	                }
	                else {
	                    clearIntveral(obj.playInterval);
	                    return;
	                }
	            }
	            obj.updateMapForAll();
	        }, obj.slideDuration);
	    });
}

// 只更新地图数据的方法
spacemap.prototype.updateData = function(jsonData){
	var obj = this;
	if(obj.dataFile==jsonData){
		return ;
	}else{
		obj.renderChart(jsonData);
	}
}

// 参数过滤方法
spacemap.prototype.paraFilter = function(opt,obj){
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
		obj.setFilterSite(site);
		obj.setFilterFans(fans);
		obj.setFilterName(name);
		obj.setFilterGroup(group);
		obj.setFilterId(id);
		obj.setFilterSfen(sfen);
		obj.setType(typeStr);
		obj.setFilterCnt(cnt);
		obj.updateMapForAll();
	}
}
//获得地图所有省份 JGR
spacemap.prototype.getEntityDefName = function(){
	var obj = this;
	obj.entityDefName=[];
	for(var i=0;i<obj.entityDef.length;i++){
		var mapObj= obj.entityDef[i];
		 obj.entityDefName.push(mapObj.sName)
	}
}
//去除数组指定值 JGR
Array.prototype.removeByValue = function(val) {
	  for(var i=0; i<this.length; i++) {
	    if(this[i] == val) {
	      this.splice(i, 1);
	      break;
	    }
	  }
	}