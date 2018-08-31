function netizen_blog_type_distribution(rid){
	var myChart = echarts.init(document.getElementById("netizen_blog_type_distribution"),"macarons");
	myChart.showLoading();
	$.getJSON("blogger/blogger_speechAnalysis_blogType_distribution", {rid: rid,vid: -1},function(json){
        if (json != null && json != "" && json != "null" && json != "[]" && json != "{}" ) {
            var jsonData = json;//JSON.parse(json.msg);
            var legendData = [];
            var dataValue = [];
            var hasData= false;
            $.each(jsonData,function(name,value) {
            	if(name=="0"){
            		legendData.push("文字");
            	}else if(name=="1"){
            		legendData.push("图片");
            	}else if(name=="2"){
            		legendData.push("视频");
            	}else if(name=="3"){
            		legendData.push("图片&视频");
            	}else{
            		legendData.push("其他");
            	}
            	//legendData.push(name);
            	dataValue.push(value);
            	hasData = true;
            });
            if(!hasData){
            	$("#netizen_blog_type_distribution").html("<img style='display:block;margin:60px auto 50px auto;' src='img/my/bt-nodata-now"+photo+".png' />");
                return;
            }
            var seriesData = [];
            for(i=0;i<legendData.length;i++){
            	var o = {};
            	o.name=legendData[i];
            	o.type="bar";
            	o.data=dataValue[i];
            	seriesData.push(o);                        	
            }
            
            var option = {
            	    tooltip : {
            	        trigger: 'axis',
            	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            	        }
            	    },
            	    legend: {
            	        data:legendData
            	    },
            	    toolbox: {
            	        show : true,
            	        orient: 'vertical',
            	        x: 'right',
            	        y: 'center',
            	        feature : {
            	            dataView : {show: true, readOnly: false},
            	            magicType : {show: true, type: [ 'stack', 'tiled']},
//            	            restore : {show: true},
            	            saveAsImage : {show: true}
            	        },
            	        right:60
            	    },
            	    calculable : true,
            	    xAxis : [
            	        {
            	            type : 'category',
            	            data : ['原创','转发','评论']
            	        }
            	    ],
            	    yAxis : [
            	        {
            	            type : 'value'
            	        }
            	    ],
            	    series : seriesData
            	};

            drawStatisticChart("netizen_blog_type_distribution", option);
        } else {
            $("#netizen_blog_type_distribution").html("<img style='display:block;margin:60px auto 50px auto;' src='img/my/bt-nodata-now"+photo+".png' />");
        }
    });
//        });
}