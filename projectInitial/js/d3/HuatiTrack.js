/**
 * 话题传播路径
	 * @param container	容器ID
	 * @param dataFile	数据文件路径
	 * @param width   宽度
	 * @param height 高度
 * @return
 */
function HuatiTrack(container, dataFile,width, height){
	this.container = $("#"+container);	//容器
	this.dataFile = dataFile;			//数据文件路径
	this.width = (width == undefined || width == null ? this.container.width() : width);					//图尺寸
	this.height = (height == undefined || height == null ? this.container.height() : height);					//图尺寸
	this.svg = d3.select('#'+container).append('svg').attr('width', width).attr('height', height);
	this.nodes = null;
	this.links = null;
	this.node = null;
	this.link = null;	
	this.colors = d3.scale.category10();
	this.selected_node = null;
    this.selected_link = null;
}
 

HuatiTrack.prototype.init = function(){
	var obj = this;
	obj.genChart();
	return obj;
}


//第一次生成图
HuatiTrack.prototype.genChart = function(){
	var obj=this;
	// 初始化nodes和links
	//  - nodes 通过id识别
	//  - reflexive edges are indicated on 	the node (as a bold black circle).
	//  - links are always source < target; 边方向，由左、右设定
	d3.json(obj.dataFile,function(graph){
		var nodes = graph.nodes;
		var links = graph.links;
		var force = d3.layout.force()
			.nodes(nodes)
			.links(links)
			.size([ obj.width, obj.height ])
			.linkDistance(150)
			.linkStrength(20)
			.charge(-500)
			.on('tick', tick);
	
	// 定义结束箭头属性
	obj.svg.append('svg:defs').append('svg:marker')
	    .attr('id', 'end-arrow')
	    .attr('viewBox', '0 -5 10 10')
	    .attr('refX', 6)            //离节点距离
	    .attr('markerWidth', 10)    //宽度
	    .attr('markerHeight', 6)  //高度
	    .attr('orient', 'auto')
	  .append('svg:path')
	    .attr('d', 'M0,-5L10,0L0,5')
	    .attr('fill', '#000');   //颜色
	
	//定义开始箭头属性
	obj.svg.append('svg:defs').append('svg:marker')
	    .attr('id', 'start-arrow')
	    .attr('viewBox', '0 -5 10 10')
	    .attr('refX', 4)
	    .attr('markerWidth', 3)
	    .attr('markerHeight', 5)
	    .attr('orient', 'auto')
	  .append('svg:path')
	    .attr('d', 'M10,-5L0,0L10,5')
	    .attr('fill', '#000');
	
	// 处理连线和点元素 
	obj.path = obj.svg.append('svg:g').selectAll('path'),
	obj.circle = obj.svg.append('svg:g').selectAll('g')
	    			.append("title").text(function(d) { return d.name; });
	restart();
	
	//绘图
	function restart() {
		//连接
	  obj.path = obj.path.data(links);
	  obj.path.enter().append('svg:path')
	    .attr('class', 'link')
	    .classed('selected', function(d) { return d === obj.selected_link; })
	    .style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
	    .style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; })
	    .append('title')
	    .text(function(d){return d.content});
	  
	  //节点
	  obj.circle = obj.circle.data(nodes, function(d) { return d.id; });
	  var g = obj.circle.enter().append('svg:g');
	   g.append('svg:circle')
	    .attr('class', 'node')
	    .attr('r', function(d) { return d.size})  //节点大小
	    .style('fill', function(d) { return d.color})  //内部颜色
	    .style('stroke', function(d) { return d.color})  //边框颜色
	    .classed('reflexive', function(d) { return d.reflexive; })
	   .call(force.drag);  //点击事件
	 
	   //设置节点属性
	  g.append('svg:text')       //添加节点内容
	      .attr('x', -10)       //偏移量
	      .attr('y', 8)
	      .attr('class', 'id')  
	      .text(function(d) { return d.name; });
	  g.append("title")      //添加节点提示
	    .text(function(d) { return d.content; });
	
	  //动态加载
	  force.start();
	}
	
	// 更新force调用方法，  定义边的走向及节点移动
	function tick() {
	  obj.path.attr('d', function(d) {
	    var deltaX = d.target.x - d.source.x,
	        deltaY = d.target.y - d.source.y,
	        dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
	        normX = deltaX / dist,
	        normY = deltaY / dist,
	        sourcePadding = d.left ? 17 : 12,
	        targetPadding = d.right ? 17 : 12,
	        sourceX = d.source.x + (sourcePadding * normX),
	        sourceY = d.source.y + (sourcePadding * normY),
	        targetX = d.target.x - (targetPadding * normX),
	        targetY = d.target.y - (targetPadding * normY);
	    return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
	  });
	  obj.circle.attr('transform', function(d) {
	    return 'translate(' + d.x + ',' + d.y + ')';
	  });
	}
 });
}