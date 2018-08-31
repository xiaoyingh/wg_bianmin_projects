var home_interaction_analysis_graph;
function home_interaction_analysis(elementId,limitNum,isfirst) {
    var categories = [];
    categories[0] = {
            name: '腾讯'
    };
    categories[1] = {
            name: '新浪'
    };
    categories[2] = {
            name: 'Twitter'
    };
	$.getJSON("blogger/blogger_dep_interaction_analysis",{limitNum : limitNum}, function(json) {
			if(!iFunc.isEmpty(json) && !iFunc.isEmpty(json.nodes)){
				home_interaction_analysis_graph = json;
				var graph = json;
			    var hasContent = false;
			    var nodesMap = {};
			    var sizeArr = [];
			    graph.nodes.forEach(function (node) {
			    	sizeArr.push(node.symbolSize);
			    });
			    sizeArr.sort(function(a,b){
			    	return b-a;
			    });
			    var showValue = 0;
			    if(sizeArr.length>=10){
			    	showValue = sizeArr[9];
			    }
			    graph.nodes.forEach(function (node) {
			    	hasContent = true;
			        node.itemStyle = null;
			        node.value = node.symbolSize;
			        node.symbolSize = node.symbolSize/8;
			        node.label = {
			            normal: {
			                show: node.symbolSize >=showValue/8
			            }
			        };
			        if(node.category==2){
			        	node.category=0;
			        }else if(node.category==4){
			        	node.category=2;
			        }
			        nodesMap[node.id] = node.name;
			    });
			    //无内容，则返回暂无相关数据
			    if(!hasContent){
			    	if(null!=isfirst){
			    		$(".blogger_interaction_limit_num").val("0");
			    		home_interaction_analysis("home_interaction_analysis",0);
			    	}else{
			    		$("#home_interaction_analysis").html("<img style='display:block;margin:60px auto 50px auto;' src='img/my/bt-nodata-now"+photo+".png' />");
			    	}
			    	return;
			    };
			    draw_home_interaction_analysis(elementId,graph,nodesMap)
			}else{
				if(null!=isfirst){
					$(".blogger_interaction_limit_num").val("0");
		    		home_interaction_analysis("home_interaction_analysis",0);
		    	}else{
		    		$("#home_interaction_analysis").html("<img style='display:block;margin:60px auto 50px auto;' src='img/my/bt-nodata-now"+photo+".png' />");
		    	}
		    	return;
			}
		});
	
	$("").find().unbind("click").click(function(){
		var limitNum = $(this).val();
	});
	
	function draw_home_interaction_analysis(elementId,graph,nodesMap){
		var option = {
		        tooltip: {				        	
		        	formatter: function(data){
				        data = data.data;
				        if(data.name!=null){
				            return "博主 ： "+data.name+"<br/>互动次数 : "+data.value;
				        }else{
				            return nodesMap[data.source]+"<-"+data.count+"->"+nodesMap[data.target];
				        }
		        	}
		        },
		        legend: [{
		        	orient: 'vertical',      // 布局方式，默认为水平布局，可选为：
		        	x: 'left',
		            data: categories.map(function (a) {
		                return a.name;
		            })
		        }],
		        lineStyle:{
		        	color:'#b1abab',
		        	type:'dotted'
		        },
		        animationDurationUpdate: 1500,
		        animationEasingUpdate: 'quinticInOut',
		        series : [
		            {
		            	name : '博主 ： 互动次数',
		                type: 'graph',
		                layout: 'circular',
		                data: graph.nodes,
		                links: graph.links,
		                categories: categories,
		                roam: true,
		                label: {
		                    normal: {
		                        position: 'right',
		                        formatter: '{b}'
		                    }
		                },
		                lineStyle: {
		                    normal: {
		                        color: 'source',
		                        curveness: 0.3
		                    }
		                }
		            }
		        ]
		    };
		drawStatisticChart(elementId, option);
	}
}