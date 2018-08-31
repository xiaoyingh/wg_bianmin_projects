//发帖习惯
function fensi_fenxi_bing(json, divID) {
	//document.getElementById("fatie_xiguan_mydiv").removeAttribute("_echarts_instance_");
	//var myChart = echarts.init(document.getElementById("fatie_xiguan_mydiv"),"macarons");
	var myChart = echarts.init(document.getElementById(divID), "macarons");
	myChart.showLoading();
	console.log(json.length)
	if(!$.isEmptyObject(json)) {
		var jsonData = json; //JSON.parse(json.msg);   

		/*var legend = {
		    orient: 'vertical',
		    x: '20',
		};*/
		var title = [];
		var data = [];
		if(jsonData) {
			/*for (var i = 0; i < jsonData.length; i++) {
			    data.push(jsonData[i].name);
			    legend.data = data;
			}*/
			for(var key in jsonData) {
				var item = {};
				item.value = jsonData[key];
				item.name = key;
				title.push(key);
				data.push(item);
			}
		}
		var option = {
			//                      	color: ['#115F94','#17A2B7', '#DA70D6', '#C07DB8', '#AF3E5E','#DEAF02','#FF7F50','#FC7D01'],
			legend: {
				//                               orient: 'vertical',
				//                              top: 'middle',
				//                              bottom: 10,
				//                              right: 10,
				data: title
			},
			tooltip: {
				trigger: 'item',
				//  formatter: "{b} : {c} ({d}%)"
				formatter: "{a} <br/>{b} : {c} ({d}%)"

			},
			toolbox: {
				show: true,
				feature: {
					//                              	dataView : {show: true, readOnly: false},
					saveAsImage: {
						show: true
					}
				},
				right:60
			},
			calculable: true,
			series: [{
				/* name: '发帖时间',*/
				type: 'pie',
				radius: '60%',
				center: ['50%', '50%'],

				itemStyle: {
					normal: {
						label: {
							show: true,
							//饼图、雷达图、仪表盘、漏斗图: a（系列名称），b（数据项名称），c（数值）, d（饼图：百分比 | 雷达图：指标名称）
							formatter: function(a, b, c, d) {
								//return "{b}\n{d}%  b d"
								if(d <= 3) {
									return b + " " + d + "%" + "\n"
								}
								if(d > 3 && d <= 7.5) {
									return b + " " + d + "%"
								}
								if(d > 6) {
									return b + "\n" + d + "%"
								}
							}
						},
						labelLine: {
							show: true,
							length: 4,
							length2: 1
						}
					}
				},
				center: ['50%', '50%'],
				data: data
			}]
		};
		drawStatisticChart(divID, option);

	} else {
		$("#" + divID).html("<div style='padding: 10px;border: 1px #ccc dashed; background-color: #f5f5f5; margin: auto; margin: 10px; margin-bottom: 10px; color: #1953a6; font-size: 14px; font-weight: bold; text-align: center;'>暂无相关数据</div>");
	}
	// });
	//        });

} //发帖习惯
function fensi_fenxi_bar(json, divID) {
	//document.getElementById("fatie_xiguan_mydiv").removeAttribute("_echarts_instance_");
	//var myChart = echarts.init(document.getElementById("fatie_xiguan_mydiv"),"macarons");
	var myChart = echarts.init(document.getElementById(divID), "macarons");
	myChart.showLoading();
	console.log(json.length)
	if(!$.isEmptyObject(json)) {
		var jsonData = JSON.parse(json); //JSON.parse(json.msg);   

		/*var legend = {
		    orient: 'vertical',
		    x: '20',
		};*/
		var title = [];
		var data = [];
		if(jsonData) {
			/*for (var i = 0; i < jsonData.length; i++) {
			    data.push(jsonData[i].name);
			    legend.data = data;
			}*/
			for(var key in jsonData) {
				var item = {};
				item.value = jsonData[key];
				item.name = key;
				title.push(key);
				data.push(jsonData[key]);
			}
		}

		var option = {
			tooltip: {
				trigger: 'axis',
			},
			grid: [{
				left: 20,
				right: 0,
				top: 10,
				bottom: '40'
			}],
			//                      	color: ['#115F94','#17A2B7', '#DA70D6', '#C07DB8', '#AF3E5E','#DEAF02','#FF7F50','#FC7D01'],
			xAxis: [{
				gridIndex: 0,
				axisTick: {
					alignWithLabel: true
				},
				data: title,
				axisLabel:{
         interval:0,
         rotate:20,
         margin: 25,
         textStyle:{
//            color:'#ddd',
              align: 'center'
             
         },
      },
			}],
			yAxis: [{
				gridIndex: 0,
			}],
			toolbox: {
				show: true,
				feature: {
					//                              	dataView : {show: true, readOnly: false},
					saveAsImage: {
						show: true
					}
				},
				right:60
			},
			calculable: true,
			series: [{
				type: 'bar',
				name: '',
				itemStyle: {
					normal: {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [{
								offset: 0,
								color: 'rgba(14,125,218,0.8)'
							}, {
								offset: 1,
								color: 'rgba(14,125,218,0.3)'
							}],
							globalCoord: false
						}
					}
				},
				data: data
			}]
		};
		drawStatisticChart(divID, option);

	} else {
		$("#" + divID).html("<div style='padding: 10px;border: 1px #ccc dashed; background-color: #f5f5f5; margin: auto; margin: 10px; margin-bottom: 10px; color: #1953a6; font-size: 14px; font-weight: bold; text-align: center;'>暂无相关数据</div>");
	}
	// });
	//        });

}