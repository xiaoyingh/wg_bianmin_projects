function netizen_sourceDev_distribution(rid){
	var myChart = echarts.init(document.getElementById("netizen_blog_sourceDev_distribution"),"macarons");
	myChart.showLoading();
    $.getJSON("blogger/blogger_speechAnalysis_sourceDev_distribution",{rid : rid}, function(json){
	if(!iFunc.isEmpty(json)){
		var nameData = [];
		var valueData = [];
		var hasdata = false;
		for(i=0;i<json.length;i++){
			hasdata = true;
			var value={};
			value.value=json[i][1];
			value.name = json[i][0];
			nameData.push(value.name);
			valueData.push(value);
	}
	if(!hasdata){
		$("#netizen_blog_sourceDev_distribution").html("<img style='display:block;margin:60px auto 50px auto;' src='img/my/bt-nodata-now"+photo+".png' />");
		return;
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
	            name:'发文工具',
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
	    drawStatisticChart("netizen_blog_sourceDev_distribution", option);
		}else{
			$("#netizen_blog_sourceDev_distribution").html("<img style='display:block;margin:60px auto 50px auto;' src='img/my/bt-nodata-now"+photo+".png' />");
		}
	});

//        })
}