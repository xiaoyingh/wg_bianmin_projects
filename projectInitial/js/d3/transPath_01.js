//绘制微博的有向的传播路径图
function tranPath(container, dataFile, width, height,chargeNum) {
	d3.scale.linear(2000);
    d3.json(dataFile,function(graph) {
    	var nodes = graph.nodes;
    	var links = graph.links;
      
        //得到点之间的距离
        links.forEach(function(link) {
            link.source = nodes[link.source] || (nodes[link.source] = {            name: link.source            });
            link.target = nodes[link.target] || (nodes[link.target] = {                name: link.target            });
        });

        var w = width,
        h = height;
        var scale=0.6,transX=w/2/scale,transY=h/2/scale,rate=1.5;
      //  console.log(transX);
       // console.log(transY);
        var force = d3.layout.force().nodes(d3.values(nodes)).links(links)
        			.size([transX,transY])
        			.linkDistance(60)
        			.friction(0.9)
        			.charge(chargeNum)
        			.on("tick", tick).start();
        var svg = d3.select("#"+container).append("svg:svg").attr("width", w).attr("height", h)
        			.attr("transform", "translate(1111, 2222) scale(0.9)");
        	
        // 为箭头定义类型
		     svg.append("svg:defs")
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
		        .attr("orient", "auto")
		        .append("svg:path")
		        .attr("d", "M0,-5L10,0L0,5");
		    
		   
		     
        // 处理连线和点元素 
    	var path = svg.append('svg:g').selectAll('path');
    	var circle = svg.append('svg:g').selectAll('circle');
    	
        
        //节点间的连线
    	  path =path.data(force.links());
        		path.enter()
        			.append("svg:path")
        			.attr("class",  function(d) {   return "link " + d.type;  })
        			.attr("marker-end",  function(d) {  return "url(#" + d.type + ")"; })
        			.append('title')
        			.text(function(d){return d.content});
        //节点
         circle = circle.data(force.nodes());
				   circle.enter()
				        .append("svg:circle")
				        .attr('r', function(d) { return d.size}) //节点大小
				        .style('fill', function(d) { return d.color }) //内部颜色
				        .style('stroke', function(d) { return d.color}) //边框颜色
				        .call(force.drag)
				        .append('title')
				        .text(function(d){
					        if(container == "bozhu_shehuifenxi") {
				        		return d.name;
							} else {
				        		return d.content;
				        	}
				        });
				   		
		circle.each(function(){
			$(this).bind("click",function(){
				var title = this.children[0].__data__;
				var cnt = title.content;
				var x = title.px;
				var y = title.py;
				$(".showCnt").css("left",Math.floor(x));
				$(".showCnt").css("top",Math.floor(y));
				$(".showCnt").show();
			//	console.log(x,y);
			//	console.log(d3.event);
		   	//	console.log( this.children[0].__data__);
		   	});
		})
	 
        var text = svg.append("svg:g")
        			  .selectAll("g")
        			  .data(force.nodes())
        			  .enter()
        			  .append("svg:g");
        text.append("svg:text")
	        .attr("x", -30)
	        .attr("y", -10)
	        .attr("class", "shadow")
	        .text(function(d) { 
	        	if(d.show==1) return d.name;
	        	else return "";
	        });
        //绑定滚轮事件
    	$("#"+container).onmousewheel = function scrollFunc(e){
    		//console.log("~~~");
    		
			var direct = 0;
			if(e.wheelDelta){//IE/Opera/Chrome 
				direct = e.wheelDelta;
			}else if(e.detail){//Firefox 
				direct = e.detail;
			}
			if(direct > 0){
				scale = scale * rate;
				transX = transX > 0 ? transX / rate : transX * rate;
				transY = transY > 0 ? transY / rate : transY * rate;
			} else if(direct < 0){
				scale = scale / rate;
				transX = transX > 0 ? transX * rate : transX / rate;
				transY = transY > 0 ? transY * rate : transY / rate;
			}
			$("svg").attr("transform", "scale("+scale+") translate("+transX+","+transY+")");
			return false;
		}
        //绑定拖动效果
    	$("#"+container).bind('mousedown',function(e){
    		dragFlag = true;
    		dragX = e.clientX;
    		dragY = e.clientY;
    		//console.log(dragX);
    		$("body").addClass("unselectable");
    		$("#"+container).bind('mousemove',function(e){
    			if(dragFlag){
    				transX = transX-(dragX-e.clientX);
    				transY = transY-(dragY-e.clientY);
    				svg.attr("transform", "scale("+scale+") translate("+transX+","+transY+")");
    				//console.log(svg.attr("transform"));
    				dragX = e.clientX;
    				dragY = e.clientY;
    			}
    			$("#"+container).bind('mouseup',function(e){
    				dragFlag = false;
    				//container.css("cursor","url(images/openhand.cur) 8 8, move");
    				$("body").removeClass("unselectable");
    			});
    		});
    	});
        function tick() {
            path.attr("d",function(d) {
                var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
                return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
            });
            circle.attr("transform",  function(d) {  return "translate(" + d.x + "," + d.y + ")"; });
            text.attr("transform",   function(d) { return "translate(" + d.x + "," + d.y + ")";  });
        }
       function click(){
    	   //console.log(d3.event);
       }
        
    })
}