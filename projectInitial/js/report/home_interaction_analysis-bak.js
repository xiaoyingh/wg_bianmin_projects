function home_interaction_analysis(elementId) {
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(elementId));
	var loadingTicket;
	var effect = [ 'spin', 'bar', 'ring', 'whirling', 'dynamicLine', 'bubble' ];
	//加载页面
	myChart.showLoading({
		text : effect[2],
		effect : effect[2],
		textStyle : {
			fontSize : 20
		}
	});

	$.getJSON("blogger/blogger_dep_interaction_analysis", function(json) {
		console.log(json);
			if(!iFunc.isEmpty(json)){
				var graph = json;
				
				var categories = [];      //选项
				for ( var i = 0; i < 7; i++) {
					categories[i] = {
						name : (i+1)+'级重点人'
					};
				}
				graph.nodes.forEach(function(node) {
					//node.itemStyle = null;
					node.value = node.Score;
					node.label = {
						normal : {
							show : node.Score > 60
						}
					};
					node.label.normal.show = node.Score > 60;
					node.category = 6//node.attributes.modularity_class;
				});
				option = {
					title : {
						text : '',
						subtext : '',
						top : 'bottom',
						left : 'right'
					},
					tooltip : {},
					legend : [ {
						show:false,
						// selectedMode: 'single',
						data : categories.map(function(a) {
							return a.name;
						})
					} ],
					animationDurationUpdate : 1500,
					animationEasingUpdate : 'quinticInOut',
					series : [ {
						name : '重点人  ： 互动次数',
						type : 'graph',
						layout : 'circular',
						data : graph.nodes,
						links : graph.links,
						categories : categories,    // 类目   通过 class对应取
						
						roam : true,
						label : {
							normal : {
								position : 'right',
								formatter : '{b}'
							}
						},
						lineStyle : {
							normal : {
								curveness : 0.3
							}
						},
						
					} ]
				};

				// 为echarts对象加载数据
				clearTimeout(loadingTicket);
				loadingTicket = setTimeout(function() {
					myChart.hideLoading();
					// 使用刚指定的配置项和数据显示图表。
					myChart.setOption(option);
				}, 500);
			}else{
				$("#home_interaction_analysis").html("<div style='padding: 10px; border: 1px #ccc dashed; background-color: #f5f5f5; margin: auto; margin: 10px; margin-bottom: 30px; color: #1953a6; font-size: 14px; font-weight: bold; text-align: center;'>暂无相关数据</div>");
			}
		});

}