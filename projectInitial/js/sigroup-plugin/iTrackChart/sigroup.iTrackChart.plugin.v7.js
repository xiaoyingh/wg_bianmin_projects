/**
 * 微博传播路径
	 * @param container	容器ID
	 * @param dataFile	数据文件路径
	 * @param option	参数
 * @return
 */

var iTrackChart = {
	showTitleFlag :	false,			//是否显示标题
	showImpTitleOnlyFlag : false,	//是否只显示重要标题
	titleLen : 10,					//title截取长度
	contentLen : 50,				//content截取长度
	scale : 0.6,					//初始比例
	zoomtype : 1,					//放大类型
	rate : 1.2,						//缩放率
	
	playBtnId : "itc-play",
	stopBtnId : "itc-stop",
	sliderId : "itc-slider",
	tipId : "itc-tip",
	toolBar : '<div class="ui-widget-header ui-corner-all" style="font-size:10px;position:absolute;bottom:0;">'+
		  '<table style="width:100%;font-size:10px;" ><tr>'+
		'<td width="65"><button id="itc-play">播放</button><button id="itc-stop">停止</button></td>'+
		'<td><div id="itc-slider" style="margin-left:10px;margin-right:10px;"></div></td>'+
		'<td width="70"><span id="itc-tip"></span></td>'+
		'</tr></table>'+
		'</div>',
	
	legend: '<div class="mtrack-legend">'+
					'<table>'+
						'<tr><td><div class="mtrack-bd"><div class="mtrack-color"></div></div></td><td><span class="mtrack-text">事件</span></td></tr>'+
						'<tr><td><div class="mtrack-bd"><div class="mtrack-color"></div></div></td><td><span class="mtrack-text">普通点</span></td></tr>'+
						'<tr><td><div class="mtrack-bd"><div class="mtrack-color"></div></div></td><td><span class="mtrack-text">引爆点</span></td></tr>'+
						'<tr><td><div class="mtrack-bd"><div class="mtrack-color"></div></div></td><td><span class="mtrack-text">推手</span></td></tr>'+
						'<tr><td><div class="mtrack-bd"><div class="mtrack-color"></div></div></td><td><span class="mtrack-text">引爆+推手</span></td></tr>'+
					'</table>'+
			'</div>',

	//color : ["steelblue","#ff0600","#00b1fb","#f6ff00","#18ff00"]
	color : ["#f6ff00","#00bfff","#ff0093","#1cff00","#ff8000","#f9becc","#ff0000","#082a89","#ff9099"]	//[亮黄,亮蓝,亮紫,亮绿,亮橙],[根,普通点,引爆点,推手,混合点]
}


iTrackChart.TrackEvolutionChart = function(container, option){
	//must
	this.container = $("#"+container);	//容器
	this.jsonObj = option && option.jsonObj ? option.jsonObj:null;					//数据文件路径
	this.jsonFile = option && option.jsonFile ? option.jsonFile:null;					//数据文件路径
	
	//option
	this.padding = option && option.padding ? option.padding:0;								//图边距
	this.width = option && option.width ? option.width:(this.container.width()-2*this.padding);					//图尺寸
	this.height = option && option.height ? option.height:(this.container.height()-2*this.padding);				//图尺寸
	
	this.callback = option && option.callback ? option.callback:null;							//回调函数
	
	this.titleLen = option && option.titleLen ? option.titleLen:iTrackChart.titleLen;						//title截取长度
	this.contentLen = option && option.contentLen ? option.contentLen:iTrackChart.contentLen;				//content截取长度
	this.showTitleFlag = option && (option.showTitleFlag == true || option.showTitleFlag == false) ? option.showTitleFlag:iTrackChart.showTitleFlag;										//是否显示标题
	this.showImpTitleOnlyFlag = option && (option.showImpTitleOnlyFlag == true || option.showImpTitleOnlyFlag == false) ? option.showImpTitleOnlyFlag:iTrackChart.showImpTitleOnlyFlag;		//是否只显示重要标题
	
	
	this.scale = option && option.scale ? option.scale:iTrackChart.scale;						//初始比例
	this.rate = option && option.rate ? option.rate:iTrackChart.rate;							//缩放率
	this.zoomtype = option && option.zoomtype ? option.zoomtype:iTrackChart.zoomtype;			//放大类型
	
	this.playBtnId = option && option.playBtnId ? option.playBtnId:iTrackChart.playBtnId;
	this.stopBtnId = option && option.stopBtnId ? option.stopBtnId:iTrackChart.stopBtnId;
	this.sliderId = option && option.sliderId ? option.sliderId:iTrackChart.sliderId;
	this.tipId = option && option.tipId ? option.tipId:iTrackChart.tipId;
	
	
	this.maxRtt = option && option.maxRtt ? option.maxRtt:null;					//转发最大
	this.minRtt = option && option.minRtt ? option.minRtt:null;					//转发最小
	this.maxFans = option && option.maxFans ? option.maxFans:null;				//粉丝数最大
	this.minFans = option && option.minFans ? option.minFans:null;				//粉丝数最小
	
	//run param
	this.tree = null;
	this.diagonal = null;
	this.svg = null;
	this.nodes = null;
	this.links = null;
	this.node = null;
	this.link = null;
	this.dragFlag = null;
	this.dragX = null;
	this.dragY = null;
	this.transX = this.width/2/this.scale;			//svg内容偏移
	this.transY = this.height/2/this.scale;			//svg内容偏移
	
	this.step = 0;		//第几步,从0编号
	this.maxStep = option && option.maxStep ? option.maxStep:0;	//最大步数,从0编号
	this.handle = null;	//
	this.isPlay = false;
	
}

iTrackChart.TrackChart = function(container, option){
	this.container = $("#"+container);	//容器
	this.jsonObj = option && option.jsonObj ? option.jsonObj:null;					//数据文件路径
	this.jsonFile = option && option.jsonFile ? option.jsonFile:null;					//数据文件路径
	
	//option
	this.padding = option && option.padding ? option.padding:0;								//图边距
	this.width = option && option.width ? option.width:(this.container.width()-2*this.padding);					//图尺寸
	this.height = option && option.height ? option.height:(this.container.height()-2*this.padding);				//图尺寸
	this.callback = option && option.callback ? option.callback:null;							//回调函数
	
	this.titleLen = option && option.titleLen ? option.titleLen:iTrackChart.titleLen;						//title截取长度
	this.contentLen = option && option.contentLen ? option.contentLen:iTrackChart.contentLen;				//content截取长度
	this.showTitleFlag = option && (option.showTitleFlag == true || option.showTitleFlag == false) ? option.showTitleFlag:iTrackChart.showTitleFlag;										//是否显示标题
	this.showImpTitleOnlyFlag = option && (option.showImpTitleOnlyFlag == true || option.showImpTitleOnlyFlag == false) ? option.showImpTitleOnlyFlag:iTrackChart.showImpTitleOnlyFlag;		//是否只显示重要标题
	
	
	this.scale = option && option.scale ? option.scale:iTrackChart.scale;						//初始比例
	this.rate = option && option.rate ? option.rate:iTrackChart.rate;							//缩放率
	this.zoomtype = option && option.zoomtype ? option.zoomtype:iTrackChart.zoomtype;			//放大类型
	
	this.maxRtt = option && option.maxRtt ? option.maxRtt:null;					//转发最大
	this.minRtt = option && option.minRtt ? option.minRtt:null;					//转发最小
	this.maxFans = option && option.maxFans ? option.maxFans:null;				//粉丝数最大
	this.minFans = option && option.minFans ? option.minFans:null;				//粉丝数最小
	
	//run param
	this.tree = null;
	this.diagonal = null;
	this.svg = null;
	this.nodes = null;
	this.links = null;
	this.node = null;
	this.link = null;
	this.dragFlag = null;
	this.dragX = null;
	this.dragY = null;
	this.transX = this.width/2/this.scale;			//svg内容偏移
	this.transY = this.height/2/this.scale;			//svg内容偏移

}

iTrackChart.TrackEvolutionChart.prototype.init = function(){
	var obj = this;
	//清除
	obj.container.empty();
	$(iTrackChart.toolBar).width(obj.container.width()).insertAfter(obj.container);
	//obj.container.after(iTrackChart.toolBar);
	obj.container.tooltip({show:{effect:"slideDown",delay:250}});
	//Legend
	obj.container.append(iTrackChart.legend);
	obj.container.find(".mtrack-color").each(function(i,n){
		$(n).css("border-color",iTrackChart.color[i]);
	});
	
	
	//绑定缩放事件
	if(obj.zoomtype == 1){
		obj.container.get(0).onmousewheel = function scrollFunc(e){
			var direct = 0;
			if(e.wheelDelta){//IE/Opera/Chrome 
				direct = e.wheelDelta;
			}else if(e.detail){//Firefox 
				direct = e.detail;
			}
			
			if(direct > 0){
				obj.scale = obj.scale * obj.rate;
				obj.transX = obj.transX > 0 ? obj.transX / obj.rate : obj.transX * obj.rate;
				obj.transY = obj.transY > 0 ? obj.transY / obj.rate : obj.transY * obj.rate;
			} else if(direct < 0){
				obj.scale = obj.scale / obj.rate;
				obj.transX = obj.transX > 0 ? obj.transX * obj.rate : obj.transX / obj.rate;
				obj.transY = obj.transY > 0 ? obj.transY * obj.rate : obj.transY / obj.rate;
			}
			$(obj.svg[0][0]).attr("transform", "scale("+obj.scale+") translate("+obj.transX+","+obj.transY+")");
			return false;
		}
	} else {
		obj.container.append("<div ref='1' class='zoombtn mblogtrack-zoomin'>+</div><div ref='-1' class='zoombtn mblogtrack-zoomout'>-</div>");
		obj.container.delegate(".zoombtn","click",function(){
			var direct = parseInt($(this).attr('ref'));
			if(direct > 0){
				obj.scale = obj.scale * obj.rate;
				obj.transX = obj.transX > 0 ? obj.transX / obj.rate : obj.transX * obj.rate;
				obj.transY = obj.transY > 0 ? obj.transY / obj.rate : obj.transY * obj.rate;
			} else if(direct < 0){
				obj.scale = obj.scale / obj.rate;
				obj.transX = obj.transX > 0 ? obj.transX * obj.rate : obj.transX / obj.rate;
				obj.transY = obj.transY > 0 ? obj.transY * obj.rate : obj.transY / obj.rate;
			}
			$(obj.svg[0][0]).attr("transform", "scale("+obj.scale+") translate("+obj.transX+","+obj.transY+")");
		});
	}
	
	//滑动事件
	obj.container.mousedown(function(e){
		obj.dragFlag = true;
		obj.dragX = e.clientX;
		obj.dragY = e.clientY;
		//不可选择
		$(document).addClass("unselectable");
	});
	obj.container.mouseup(function(e){
		obj.dragFlag = false;
		//不可选择
		$(document).removeClass("unselectable");
	});
	obj.container.mousemove(function(e){
			if(obj.dragFlag){
				obj.transX = obj.transX-(obj.dragX-e.clientX);
				obj.transY = obj.transY-(obj.dragY-e.clientY);
				$(obj.svg[0][0]).attr("transform", "scale("+obj.scale+") translate("+obj.transX+","+obj.transY+")");
				obj.dragX = e.clientX;
				obj.dragY = e.clientY;
			}
	});
	//播放按钮事件
	$("#"+obj.playBtnId).button({
    	text: false,
      	icons: {
        	primary: "ui-icon-play"
      	}
    }).click(function(){
		if(!obj.isPlay){
			obj.setIsPlay(true).play();
		} else {
			obj.pause();
		}
	});
    $("#"+obj.stopBtnId).button({
      	text: false,
      	icons: {
        	primary: "ui-icon-stop"
      	}
    }).click(function(){
		obj.stop();
	});

/*
	$("#"+obj.tipId).html(obj.jsonObj.time[0]);
	$("#"+obj.sliderId).slider({
      min: 0,
      max: obj.jsonObj.time.length-1,
      range: "min",
      value: 0,
      slide: function( event, ui ) {
		$("#"+obj.tipId).html(obj.jsonObj.time[ui.value]);
        obj.pause().setStep(ui.value).updateChart();
      }
    });
	*/
	//初次生成图
	obj.genChart();
	return obj;
}
iTrackChart.TrackEvolutionChart.prototype.genChart = function(){
	var obj = this;
	//console.log(obj.maxRtt);
	//console.log(obj.minRtt);
	//console.log(obj.maxFans);
	//console.log(obj.minFans);
	
	//生成图
	obj.tree = d3.layout.tree()
    .size([360, obj.width])
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });
	
	obj.diagonal = d3.svg.diagonal.radial()
	    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });
	
	//svg的宽度、高度，中心的位置
	obj.svg = d3.select("#"+obj.container.get(0).id).append("svg")
	.attr("width", obj.width)
	.attr("height", obj.height)
	.append("g")
	.attr("transform", "scale("+obj.scale+") translate(" + obj.transX + "," + obj.transY + ")");

	if(obj.jsonFile){
		d3.json(obj.jsonFile, function(error, root) {
			console.log(root);
			obj.jsonObj = root;
			obj.renderChart();
		});
	} else if(obj.jsonObj){
		obj.renderChart();
	}
	return obj;
}

iTrackChart.TrackEvolutionChart.prototype.renderChart = function(){
	var obj = this;
	
	$("#"+obj.tipId).html(obj.jsonObj.time[0]);
	$("#"+obj.sliderId).slider({
      min: 0,
      max: obj.jsonObj.time.length-1,
      range: "min",
      value: 0,
      slide: function( event, ui ) {
		$("#"+obj.tipId).html(obj.jsonObj.time[ui.value]);
        obj.pause().setStep(ui.value).updateChart();
      }
    });
	
	console.log(obj.jsonObj.data);
	obj.nodes = obj.tree.nodes(obj.jsonObj.data);
	obj.links = obj.tree.links(obj.nodes);
	
	//首节点标志
	obj.nodes[0].ishead = true;
	
	obj.link = obj.svg.selectAll(".link")
	  .data(obj.links)
	  .enter().append("path")
	  .attr("class", "link")
	  .attr("d", obj.diagonal);
	
	obj.node = obj.svg.selectAll(".node")
	  .data(obj.nodes)
	  .enter().append("g")
	  //.attr("style", "fill:#fff")
	  .attr("class", "node tagtext")
	  .attr("title", function(d) { return d.content?d.content:d.name; })
	  //.attr("content", function(d) { return d.content; })
	  .attr("data-id", function(d) { return d.id; })
	  .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });
	
	obj.node.append("circle")
	  .attr("r", 3);
	  //.attr("style", function(d){ return d.color == undefined || d.color == null || d.color == "" ?"":"fill:"+d.color+";stroke:"+d.color; });
	
	obj.node.append("text")
	  .attr("dy", ".31em")
	  .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
	  .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; });
	
	//改变鼠标状态
	obj.container.delegate("g.node","mouseenter", function(){
		$(this).css("cursor","pointer");
	});
	obj.container.delegate("g.node","mouseleave", function(){
		$(this).css("cursor","default");
	});
	
	//回调
	//if(obj.callback){
	//	obj.callback(obj.container);
	//}
	
	//刷新图执行过滤
	obj.updateChart();
	return obj;
}



iTrackChart.TrackEvolutionChart.prototype.updateChart = function(){
	var obj = this;
	//过滤边
	obj.link.attr("style", function(d,i){
		//console.log(i);
		//是根节点并且rtt和fans都符合范围的显示。
		if((d.source.ishead || (obj.compareRtt(d.source.rtt) && obj.compareFans(d.source.fans) && obj.isShow(d.source.show)))  &&  
			(d.target.ishead || (obj.compareRtt(d.target.rtt) && obj.compareFans(d.target.fans) && obj.isShow(d.target.show)))){
			return "";
		} else {
			return "display:none;";
		}
	});
	//过滤点
	obj.node.attr("style", function(d,i){
		//console.log(i);
		var temp_style = "";
		//是根节点并且rtt和fans都符合范围的显示。
		if(d.ishead || (obj.compareRtt(d.rtt) && obj.compareFans(d.fans) && obj.isShow(d.show))){
			//temp_style += "fill:#fff;";
			if(!d.ishead){
				switch(d.type.charAt(obj.step)){
				case "0":
					temp_style += "fill:"+iTrackChart.color[1]+";";
					break;
				case "1":
					temp_style += "fill:"+iTrackChart.color[2]+";";
					break;
				case "2":
					temp_style += "fill:"+iTrackChart.color[3]+";";
					break;
				case "3":
					temp_style += "fill:"+iTrackChart.color[4]+";";
					break;
				}
			} else {
				temp_style += "fill:"+iTrackChart.color[0]+";";
			}
		} else {
			temp_style += "display:none;";
		}
		return temp_style;
	});
	
	obj.node.selectAll("circle").attr("r", function(d,i){
		var temp_style = 3;
		if(!d.ishead){
			switch(d.type){
			case "0":
				//temp_style = "fill:"+iTrackChart.color[0]+";";
				break;
			case "1":
				temp_style = temp_style<<1;
				break;
			case "2":
				temp_style = temp_style<<1;
				break;
			case "3":
				temp_style = temp_style<<1;
				break;
			}
		} else {
			temp_style = temp_style<<3;
		}
		return temp_style;
	});
	
	obj.node.selectAll("text").text(function(d) {
		//是否显示标题
		if(obj.showTitleFlag){
			//是否只显示重要节点标题
			  if(obj.showImpTitleOnlyFlag){
				  /*
				  if(d.type && d.type.charAt(obj.step) == "1"){
					  return d.name; 
				  }
				  */
				  if(obj.isKey(d.type)){
					  return d.myname; 
				  }
			  } else {
				  return d.myname;
			  }
		  }
		  return "";
	});
	
	//回调
	if(obj.callback){
		obj.callback(obj);
	}
	
	
	return obj;
}

//是否显示标题
iTrackChart.TrackEvolutionChart.prototype.setShowTitleFlag = function(d){
	this.showTitleFlag = d == true || d == false ? d:true;
	return this;
}
//是否只显示重要节点标题
iTrackChart.TrackEvolutionChart.prototype.setShowImpTitleOnlyFlag = function(d){
	this.showImpTitleOnlyFlag = d == true || d == false ? d:false;
	return this;
}
//最大转发
iTrackChart.TrackEvolutionChart.prototype.setMaxRtt = function(d){
	this.maxRtt = d==null?null:parseInt(d);
	return this;
}
//最小转发
iTrackChart.TrackEvolutionChart.prototype.setMinRtt = function(d){
	this.minRtt = d==null?null:parseInt(d);
	return this;
}
//最大粉丝
iTrackChart.TrackEvolutionChart.prototype.setMaxFans = function(d){
	this.maxFans = d==null?null:parseInt(d);
	return this;
}
//最小粉丝
iTrackChart.TrackEvolutionChart.prototype.setMinFans = function(d){
	this.minFans = d==null?null:parseInt(d);
	return this;
}

//设置步骤
iTrackChart.TrackEvolutionChart.prototype.setStep = function(d){
	this.step = d==null?0:parseInt(d);
	return this;
}
//设置步骤
iTrackChart.TrackEvolutionChart.prototype.setIsPlay = function(d){
	this.isPlay = d == true || d == false ? d:false;
	return this;
}


//是否显示节点
iTrackChart.TrackEvolutionChart.prototype.isShow = function(show){
	var obj = this;
	if(show){
		return show.charAt(obj.step)=="1"?true:false
	}
	return true;
}

//是否为关键点
iTrackChart.TrackEvolutionChart.prototype.isKey = function(type){
	var obj = this;
	if(type){
		var temp = type.charAt(obj.step);
		return (temp=="1"||temp=="2"||temp=="3")?true:false
	}
	return false;
}


//转发过滤	在范围内返回true
iTrackChart.TrackEvolutionChart.prototype.compareRtt = function(count){
	var obj = this;
	var flag = true;
	//console.log(count);
	var d = parseInt(count);
	//console.log(d);
	if(count != undefined){
		if(obj.maxRtt == null && obj.minRtt == null){
			//console.log("one");
			flag = true;
		} else if(obj.maxRtt == null && obj.minRtt <= d){
			//console.log("two");
			flag = true;
		} else if(obj.minRtt == null && obj.maxRtt >= d){
			//console.log("three");
			flag = true;
		} else if(obj.maxRtt != null && obj.minRtt != null && obj.minRtt <= d && obj.maxRtt >= d){
			//console.log("four");
			flag = true;
		} else {
			//console.log("five");
			flag = false;
		}
	} else {
		//console.log("null");
		flag = true;
	}
	return flag;
}
//粉丝过滤	在范围内返回true
iTrackChart.TrackEvolutionChart.prototype.compareFans = function(count){
	var obj = this;
	var flag = true;
	var d = parseInt(count);
	//console.log(count);
	if(count != undefined){
		if(obj.maxFans == null && obj.minFans == null){
			flag = true;
		} else if(obj.maxFans == null && obj.minFans <= d){
			flag = true;
		} else if(obj.minFans == null && obj.maxFans >= d){
			flag = true;
		} else if(obj.maxFans != null && obj.minFans != null && obj.minFans <= d && obj.maxFans >= d){
			flag = true;
		} else {
			flag = false;
		}
	} else {
		flag = true;
	}
	return flag;
}

//play
iTrackChart.TrackEvolutionChart.prototype.play = function(){
	var obj = this;
	if(obj.isPlay){
		//obj.isPlay = true;
		if(obj.step <= obj.maxStep){
			$("#"+obj.playBtnId).button( "option", {
				label: "pause",
				icons: {
	            	primary: "ui-icon-pause"
	          	}
		    });
			$("#"+obj.sliderId).slider("value", obj.step);
			$("#"+obj.tipId).html(obj.jsonObj.time[obj.step]);
			obj.updateChart();
			obj.step++;
			obj.handle = setTimeout(function(){
				obj.play();
			}, 1000);
		} else {
			obj.stop();
		}
	}
	return obj;
}

iTrackChart.TrackEvolutionChart.prototype.pause = function(){
	var obj = this;
	obj.isPlay = false;
	$("#"+obj.playBtnId).button( "option", {
        label: "play",
        icons: {
          primary: "ui-icon-play"
        }
    });
	return obj;
}

iTrackChart.TrackEvolutionChart.prototype.stop = function(){
	var obj = this;
	obj.isPlay = false;
	obj.step = 0;
	obj.updateChart();
	$("#"+obj.sliderId).slider("value", 0);
	$("#"+obj.playBtnId).button( "option", {
        label: "play",
        icons: {
          primary: "ui-icon-play"
        }
    });
	return obj;
}




//--------------------------------------------------------//


iTrackChart.TrackChart.prototype.init = function(){
	var obj = this;
	//清除
	obj.container.empty();
	obj.container.tooltip({show:{effect:"slideDown",delay:250},
		position: { my: "left top", at: "left bottom+20" }//my的相对位置，at触发元素的相对位置
	});
	
	//Legend
	obj.container.append(iTrackChart.legend);
	obj.container.find(".mtrack-color").each(function(i,n){
		$(n).css("border-color",iTrackChart.color[i]);
	});
	//绑定缩放事件
	if(obj.zoomtype == 1){
		obj.container.get(0).onmousewheel = function scrollFunc(e){
			var direct = 0;
			if(e.wheelDelta){//IE/Opera/Chrome 
				direct = e.wheelDelta;
			}else if(e.detail){//Firefox 
				direct = e.detail;
			}
			
			if(direct > 0){
				obj.scale = obj.scale * obj.rate;
				obj.transX = obj.transX > 0 ? obj.transX / obj.rate : obj.transX * obj.rate;
				obj.transY = obj.transY > 0 ? obj.transY / obj.rate : obj.transY * obj.rate;
			} else if(direct < 0){
				obj.scale = obj.scale / obj.rate;
				obj.transX = obj.transX > 0 ? obj.transX * obj.rate : obj.transX / obj.rate;
				obj.transY = obj.transY > 0 ? obj.transY * obj.rate : obj.transY / obj.rate;
			}
			$(obj.svg[0][0]).attr("transform", "scale("+obj.scale+") translate("+obj.transX+","+obj.transY+")");
			return false;
		}
	} else {
		obj.container.append("<div ref='1' class='zoombtn mblogtrack-zoomin'>+</div><div ref='-1' class='zoombtn mblogtrack-zoomout'>-</div>");
		obj.container.delegate(".zoombtn","click",function(){
			var direct = parseInt($(this).attr('ref'));
			if(direct > 0){
				obj.scale = obj.scale * obj.rate;
				obj.transX = obj.transX > 0 ? obj.transX / obj.rate : obj.transX * obj.rate;
				obj.transY = obj.transY > 0 ? obj.transY / obj.rate : obj.transY * obj.rate;
			} else if(direct < 0){
				obj.scale = obj.scale / obj.rate;
				obj.transX = obj.transX > 0 ? obj.transX * obj.rate : obj.transX / obj.rate;
				obj.transY = obj.transY > 0 ? obj.transY * obj.rate : obj.transY / obj.rate;
			}
			$(obj.svg[0][0]).attr("transform", "scale("+obj.scale+") translate("+obj.transX+","+obj.transY+")");
		});
	}
	
	//滑动事件
	obj.container.mousedown(function(e){
		obj.dragFlag = true;
		obj.dragX = e.clientX;
		obj.dragY = e.clientY;
		//不可选择
		$(document).addClass("unselectable");
	});
	obj.container.mouseup(function(e){
		obj.dragFlag = false;
		//不可选择
		$(document).removeClass("unselectable");
	});
	obj.container.mousemove(function(e){
			if(obj.dragFlag){
				obj.transX = obj.transX-(obj.dragX-e.clientX);
				obj.transY = obj.transY-(obj.dragY-e.clientY);
				$(obj.svg[0][0]).attr("transform", "scale("+obj.scale+") translate("+obj.transX+","+obj.transY+")");
				obj.dragX = e.clientX;
				obj.dragY = e.clientY;
			}
	});
	
	//初次生成图
	obj.genChart();
	return obj;
}



iTrackChart.TrackChart.prototype.genChart = function(){
	var obj = this;
	//console.log(obj.maxRtt);
	//console.log(obj.minRtt);
	//console.log(obj.maxFans);
	//console.log(obj.minFans);
	
	//生成图
	obj.tree = d3.layout.tree()
    .size([360, obj.width])
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });
	
	obj.diagonal = d3.svg.diagonal.radial()
	    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });
	
	//svg的宽度、高度，中心的位置
	obj.svg = d3.select("#"+obj.container.get(0).id).append("svg")
	.attr("width", obj.width)
	.attr("height", obj.height)
	.append("g")
	.attr("transform", "scale("+obj.scale+") translate(" + obj.transX + "," + obj.transY + ")");
	
	console.log(obj.jsonObj);
	if(obj.jsonFile){
		d3.json(obj.jsonFile, function(error, root) {
			console.log(root);
			obj.jsonObj = root;
			obj.renderChart();
		});
	} else if(obj.jsonObj){
		obj.renderChart();
	}
	
	return obj;
}

iTrackChart.TrackChart.prototype.renderChart = function(){
	var obj = this;
	
	obj.nodes = obj.tree.nodes(obj.jsonObj);
	obj.links = obj.tree.links(obj.nodes);
		
		//首节点标志
		obj.nodes[0].ishead = true;
		
		obj.link = obj.svg.selectAll(".link")
		  .data(obj.links)
		  .enter().append("path")
		  .attr("class", "link")
		  .attr("d", obj.diagonal);
		
		obj.node = obj.svg.selectAll(".node")
		  .data(obj.nodes)
		  .enter().append("g")
		  //.attr("style", "fill:#fff")
		  .attr("class", "node tagtext")
		  .attr("title", function(d) { return d.content?d.content:d.name; })
		  //.attr("content", function(d) { return d.content; })
		  .attr("data-id", function(d) { return d.id; })
		  .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });
		

		obj.node.append("circle")
		  .attr("r", 3);
		  //.attr("style", function(d){ return d.color == undefined || d.color == null || d.color == "" ?"":"fill:"+d.color+";stroke:"+d.color; });
		
		obj.node.append("text")
		  .attr("dy", "2.61em")
		  .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
		  .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; });
		
		//改变鼠标状态
		obj.container.delegate("g.node","mouseenter", function(){
			$(this).css("cursor","pointer");
		});
		obj.container.delegate("g.node","mouseleave", function(){
			$(this).css("cursor","default");
		});
		
		/*
		//回调
		if(obj.callback){
			obj.callback(obj.container);
		}
		*/
		//刷新图执行过滤
		obj.updateChart();
}
iTrackChart.TrackChart.prototype.updateChart = function(){
	var obj = this;
	//过滤边
	obj.link.attr("style", function(d,i){
		//console.log(i);
		//是根节点并且rtt和fans都符合范围的显示。
		if((d.source.ishead || (obj.compareRtt(d.source.rtt) && obj.compareFans(d.source.fans)))  &&  (d.target.ishead || (obj.compareRtt(d.target.rtt) && obj.compareFans(d.target.fans)))){
			return "";
		} else {
			return "display:none;";
		}
	});
	//过滤点
	obj.node.attr("style", function(d,i){
		//console.log(i);
		var temp_style = "";
		//是根节点并且rtt和fans都符合范围的显示。
		if(d.ishead || (obj.compareRtt(d.rtt) && obj.compareFans(d.fans))){
			if(!d.ishead){
				switch(d.type){
				case "1":
					temp_style += "fill:"+iTrackChart.color[1]+";";
					break;
				case "2":
					temp_style += "fill:"+iTrackChart.color[2]+";";
					break;
				case "3":
					temp_style += "fill:"+iTrackChart.color[3]+";";
					break;
				case "4":
					temp_style += "fill:"+iTrackChart.color[4]+";";
					break;
				case "5":
					temp_style += "fill:"+iTrackChart.color[5]+";";
					break;
				case "6":
					temp_style += "fill:"+iTrackChart.color[6]+";";
					break;
				case "7":
					temp_style += "fill:"+iTrackChart.color[7]+";";
					break;
				case "8":
					temp_style += "fill:"+iTrackChart.color[8]+";";
					break;
				}
			} else {
				temp_style += "fill:"+iTrackChart.color[0]+";";
			}
		} else {
			temp_style += "display:none;";
		}
		return temp_style;
	});
	
	obj.node.selectAll("circle").attr("r", function(d,i){
		var temp_style = 3;
		if(!d.ishead){
			switch(d.type){
			case "1":
				//temp_style = "fill:"+iTrackChart.color[0]+";";
				temp_style = temp_style<<4;
				break;
			case "2":
				temp_style = temp_style<<4;
				break;
			case "3":
				temp_style = temp_style<<4;
				break;
			case "4":
				temp_style = temp_style<<4;
				break;
			case "5":
				temp_style = temp_style<<4;
				break;
			case "6":
				temp_style = temp_style<<4;
				break;
			case "7":
				temp_style = temp_style<<4;
				break;
			case "8":
				temp_style = temp_style<<4;
				break;
			}
		} else {
			temp_style = temp_style<<4;
		}
		return temp_style;
	});
	
	
	obj.node.selectAll("text").text(function(d) {
		//是否显示标题
		if(obj.showTitleFlag){
			//是否只显示重要节点标题
			  if(obj.showImpTitleOnlyFlag){
				 // if(obj.isKey(d.type)){
					  return d.myname; 
				//  }
			  } else {
				  return d.myname;
			  }
		  }
		  return "";
	});
	
	//回调
	if(obj.callback){
		obj.callback(obj);
	}
	
	return obj;
}

//是否显示标题
iTrackChart.TrackChart.prototype.setShowTitleFlag = function(d){
	this.showTitleFlag = d == true || d == false ? d:true;
	return this;
}
//是否只显示重要节点标题
iTrackChart.TrackChart.prototype.setShowImpTitleOnlyFlag = function(d){
	this.showImpTitleOnlyFlag = d == true || d == false ? d:false;
	return this;
}
//最大转发
iTrackChart.TrackChart.prototype.setMaxRtt = function(d){
	this.maxRtt = d==null?null:parseInt(d);
	return this;
}
//最小转发
iTrackChart.TrackChart.prototype.setMinRtt = function(d){
	this.minRtt = d==null?null:parseInt(d);
	return this;
}
//最大粉丝
iTrackChart.TrackChart.prototype.setMaxFans = function(d){
	this.maxFans = d==null?null:parseInt(d);
	return this;
}
//最小粉丝
iTrackChart.TrackChart.prototype.setMinFans = function(d){
	this.minFans = d==null?null:parseInt(d);
	return this;
}
//转发过滤	在范围内返回true
iTrackChart.TrackChart.prototype.compareRtt = function(count){
	var obj = this;
	var flag = true;
	//console.log(count);
	var d = parseInt(count);
	//console.log(d);
	if(count != undefined){
		if(obj.maxRtt == null && obj.minRtt == null){
			//console.log("one");
			flag = true;
		} else if(obj.maxRtt == null && obj.minRtt <= d){
			//console.log("two");
			flag = true;
		} else if(obj.minRtt == null && obj.maxRtt >= d){
			//console.log("three");
			flag = true;
		} else if(obj.maxRtt != null && obj.minRtt != null && obj.minRtt <= d && obj.maxRtt >= d){
			//console.log("four");
			flag = true;
		} else {
			//console.log("five");
			flag = false;
		}
	} else {
		//console.log("null");
		flag = true;
	}
	return flag;
}
//粉丝过滤	在范围内返回true
iTrackChart.TrackChart.prototype.compareFans = function(count){
	var obj = this;
	var flag = true;
	var d = parseInt(count);
	//console.log(count);
	if(count != undefined){
		if(obj.maxFans == null && obj.minFans == null){
			flag = true;
		} else if(obj.maxFans == null && obj.minFans <= d){
			flag = true;
		} else if(obj.minFans == null && obj.maxFans >= d){
			flag = true;
		} else if(obj.maxFans != null && obj.minFans != null && obj.minFans <= d && obj.maxFans >= d){
			flag = true;
		} else {
			flag = false;
		}
	} else {
		flag = true;
	}
	return flag;
}
//是否为关键点
iTrackChart.TrackChart.prototype.isKey = function(type){
	var obj = this;
	if(type){
		return (type=="1"||type=="2"||type=="3")?true:false
	}
	return false;
}
