//绘制微博的有向的传播路径图
function tranPath(container, dataFile, width, height,chargeNum, flag) {
	this.container =container;	//容器
	this.dataFile = dataFile;			//数据文件路径
	this.width = (width == undefined || width == null ? this.container.width() : width);					//图尺寸
	this.height = (height == undefined || height == null ? this.container.height() : height);					//图尺寸
	this.chargeNum = chargeNum;
	this.flag = flag;
	this.svg = null;
	this.nodes = null;
	this.circle = null;
	this.links = null;
	this.text = null;
	this.scale = 0.5;						//初始比例
	this.transX = this.width/2/this.scale;			//svg内容偏移
	this.transY = this.height/2/this.scale;			//svg内容偏移
	
	this.maxSize = null;
	this.minSize = null;
	this.clickFlag =false;
	this.filterColor=[];
}
tranPath.prototype.init = function(){
	var obj = this;
	$("#"+obj.container).empty();
	obj.genChart();
	return obj;
}
 
/**更新图*/
tranPath.prototype.updateChart = function(){
	var obj = this;
	obj.circle.attr("display",function(d,i){
		if(!obj.compareCircleColor(d.color.toLowerCase().trim())) 
			return "none";
		else return "block";
	});
	
	obj.path.attr("display",function(d,i){
		if(!obj.compareCircleColor(d.source.color.toLowerCase().trim())||!obj.compareCircleColor(d.target.color.toLowerCase().trim()))
			return "none";
		else return "block";
	})
	
	obj.text.attr("display",function(d){
		if(!obj.compareCircleColor(d.color.toLowerCase().trim()))
			return "none";
		else return "block";
	});
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
	console.log(this.filterColor);
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

/**过滤节点，设置最大最小值*/
tranPath.prototype.setMaxSize = function(d){
	this.maxSize = d==null?null:parseInt(d);
}
tranPath.prototype.setMinSize = function(d){
	this.minSize = d==null?null:parseInt(d);
}
/**比较图圈大小，确定是否显示*/
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
/**初始化画图*/
tranPath.prototype.genChart = function(){
	var obj = this;
	var tip =d3.tip()
	   .attr('class', 'd3-tip')
	   .offset([-10, 0])
	    .html(function(d) {
	    	if(d.fcontent!=""){
		   var len = d.fcontent.length;
		   var content = d.fcontent.slice(0,len-2);
		   var time = d.fcontent.slice(len-2,len-1);
		   var t = len-2;
		   if(d.fcount=='undefined') 
			   return "";
		   return "<div><div class='tipTitle'><span style='font-weight:bold;'>" +d.source.name+"</span>:</div><div>"+ content +"</br><span class='time'>"+time+"</span></div></div>";
	    	}
	    })
	     	
	
	 fill = d3.scale.category20();
	 obj.svg = d3.select("#"+obj.container)  //放大缩小
		.append("svg:svg")
		.attr("width", obj.width)
		.attr("height",obj.height)
		.attr("pointer-events", "all")
		.append('svg:g')
	    .call(d3.behavior.zoom().on("zoom", function(){
	    	  obj.svg.attr("transform",
	        	      "translate(" + d3.event.translate + ")"
	        	      + " scale(" + d3.event.scale + ")");
	    }))
	    .append('svg:g');
  obj.svg.append('svg:rect') //平移框
     .attr('width',obj.width )
     .attr('height',obj.height)
     .attr('fill', 'white');
  
  obj.svg.call(tip)  //调用提示
  
    d3.json(obj.dataFile,function(graph) {
    	obj.nodes = graph.nodes;
    	obj.links = graph.links;
        //得到点之间的距离
        obj.links.forEach(function(link) {
        	link.source = obj.nodes[link.source] || (obj.nodes[link.source] = {name: link.source });
        	link.target = obj.nodes[link.target] || (obj.nodes[link.target] = {name: link.target  });
        });
        var force = d3.layout.force()
        			.nodes(d3.values(obj.nodes))
        			.links(obj.links)
        			.size([obj.transX,obj.transY])
        			.linkDistance(60)
        			.friction(0.9)
        			.charge(obj.chargeNum)
        			.on("tick", function(){
        		            obj.path.attr("d",function(d) {
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
		        .attr("markerWidth", 6)
		        .attr("markerHeight", 6)
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
        			.attr("style",function(d){return "stroke-width:"+d.size+"px"})
        			.attr("marker-end",  function(d) {  return "url(#" + d.type + ")"; })
        			.on('mouseover', tip.show)
        		 	.on('mouseout', tip.hide)
    				.on('click',function(d){
    					if (d3.event.defaultPrevented) return; 
    					if(obj.clickFlag) obj.clickFlag = false;
    					else obj.clickFlag = true;
    					if(obj.clickFlag){
    					var box = d3.event.target.getBBox();
    					var f = document.body.scrollTop,
    				        i = document.body.scrollLeft,
    				        x = box.x+f+20,
    				        y = box.y+i;
    					var len = d.acontent.length;
    					var interContent = '';
    					for(var i=0;i<len;i++){
    						interContent+=d.acontent[i]+"\n";
    					}
    					d3.select("#tooltip")
    					  .style("left",x + "px")
    					  .style("top", y + "px")
    					  .select(".TipContent")
    					  .text(interContent);
    					d3.select(".TipTitle")
    					  .text(d.source.name);
    				 
    					d3.select("#tooltip").classed("hidden", false);
    					}else {
    						d3.select("#tooltip").classed("hidden", true);	
    					}
    				});
        //节点---分成g,circle层级，就支持点击事件
         obj.circle = obj.circle.data(force.nodes());
     			obj.circle.enter()
				        .append("g")
				        .attr("class","nodes")
				  
	        obj.circle.append('circle')
	        			.attr('r', function(d) { return d.size}) //节点大小
	        			.style('fill', function(d) { return d.color }) //内部颜色
	        			.style('stroke', function(d) { return d.color}) //边框颜色
	        			
		     obj.circle.append('title')
				        .text(function(d){
					        if(obj.container == "bozhu_shehuifenxi") {
				        		return d.name;
							} else {
				        		return d.content;
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
	        	if(obj.flag) return d.name;//点击‘显示所有博主名称’链接
	        	else {if(d.show==1) return d.name;else return "";}
	        });
    })
}