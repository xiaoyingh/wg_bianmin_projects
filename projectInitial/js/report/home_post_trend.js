function home_post_trend(elementId) {
	

	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(elementId));
	var loadingTicket;
	var effect = ['spin', 'bar', 'ring', 'whirling', 'dynamicLine', 'bubble'];
	myChart.showLoading({
		text: effect[2],
		effect: effect[2],
		textStyle: {
			fontSize: 20
		}
	});

	
	$.getJSON("json_infoQuery_home_post_trend.action",function(json){
		if(!iFunc.isEmpty(json.msg)){
			var data = JSON.parse(json.msg);
			var xAxis_data = [];
			var series_data = [];
			$.each(data,function(i,n){
				xAxis_data.push(n.time);
				series_data.push(n.value);
			});
			
			
			
			// 指定图表的配置项和数据
			var option = {
				tooltip : {
					trigger : 'axis'
				},
				calculable : true,
				xAxis : [ {
					type : 'category',
					boundaryGap : false,
					data : xAxis_data,
					axisLine:{
						lineStyle:{
							color:'#BB820A',
							width: 2
						}
					}
				}],
				yAxis : [ {
					type : 'value',
					axisLabel : {
						formatter : '{value}'
					},
					axisLine:{
						lineStyle:{
							color:'#F0A348'
						}
					}
				} ],
				dataZoom: {
				   show: true,
				   start : 0,
				   //backgroundColor:'#F2F4F4',
				   height: '8%',
				   dataBackgroundColor:'#F1FAFF'
				},
				series : [ {
					name : '发帖趋势',
					type : 'line',
					data : series_data,
					markLine:{
						data: [{
		                    name: '平均线',
		                    // 支持 'average', 'min', 'max'
		                    type: 'average'
							}],
						lineStyle:{
							normal:{
								color:'#3299CD'
							}
						}
					}
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
			$("#zdr_post_trend").html("<img style='display:block;margin:60px auto 50px auto;' src='img/my/bt-nodata-now"+photo+".png' />");  
		}
	});
	
	

	
}
