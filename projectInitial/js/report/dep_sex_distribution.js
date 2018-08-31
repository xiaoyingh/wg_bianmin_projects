function dep_sex_distribution(data){
	var myChart = echarts.init(document.getElementById("dep_sex_distribution"),"macarons");
	myChart.showLoading();
        $.post("blogger/blogger_dep_sex_distribution",
			{
				data : data
			}, function(json) {
		if(!iFunc.isEmpty(json)){
			var nameData = [];
			var valueData = [];
			for(i=0;i<json.length;i++){
				var value={};
				value.value=json[i][1];
				value.name = json[i][0];
				if(value.name==0){
					value.name = "未知";
				}
				if(value.name==1){
					value.name = "女";
				}
				if(value.name==2){
					value.name = "男";
				}
				nameData.push(value.name);
				valueData.push(value);
			}
        var option = {
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    legend: {
		        orient : 'vertical',
		        x : 'left',
		        data:nameData
		    },
		    toolbox: {
		        show : true,
		        feature : {
		            dataView : {show: true, readOnly: false},
		            saveAsImage : {show: true}
		        },
		        right:60
		    },
		    calculable : true,
		    series : [
		        {
		            name:'性别',
		            type:'pie',
		            radius : ['50%', '70%'],
		            itemStyle : {
		                normal : {
		                    label : {
		                        show : false
		                    },
		                    labelLine : {
		                        show : false
		                    }
		                },
		                emphasis : {
		                    label : {
		                        show : true,
		                        position : 'center',
		                        textStyle : {
		                            fontSize : '30',
		                            fontWeight : 'bold'
		                        }
		                    }
		                }
		            },
		            data:valueData
		        }
		    ]
		};
//		  // 为echarts对象加载数据
//        clearTimeout(loadingTicket);
//        loadingTicket = setTimeout(function() {
//                myChart.hideLoading();
//                myChart.setOption(option);
//                ChartPlugin.saveChart(myChart, 1);
//                saveEchartOption("dep_sex_distribution", option);
//            },
//            500);
        drawStatisticChart("dep_sex_distribution", option);
		}else{
			$("#dep_sex_distribution").html("<img style='display:block;margin:60px auto 50px auto;' src='img/my/bt-nodata-now"+photo+".png' />");
		}
	},"json");

//    })

}