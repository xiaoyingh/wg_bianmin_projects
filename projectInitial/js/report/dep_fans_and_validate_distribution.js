function dep_fans_and_validate_distribution(data){
	var myChart = echarts.init(document.getElementById("dep_fans_and_validate_distribution"),"macarons");
	myChart.showLoading();
            $.post("blogger/blogger_dep_fans_and_validate_distribution", {
                    data:data
                },
                function(json) {
                    if (json != null && json != "" && json != "null" && json != "[]") {
                        //console.log(json.msg);    
                        
                        var jsonData = json;//JSON.parse(json.msg);
                        console.log(jsonData);
                        var legendData = [];
                        var dataValue = [];
                        $.each(jsonData,function(name,value) {
                        	legendData.push(name);
                        	dataValue.push(value);
                        });
                        var seriesData = [];
                        for(j=0;j<=3;j++){                       	
                        	var o = {};
                        	if(j==0){
                        		o.name="非认证";
                        	}
                        	if(j==1){
                        		o.name="达人";
                        	}
                        	if(j==2){
                        		o.name="个人认证";
                        	}
                        	if(j==3){
                        		o.name="机构认证";
                        	}
                        	o.data = [];
	                        for(i=0;i<legendData.length;i++){
	                        	o.type="bar";
	                        	o.data.push(dataValue[i][j]);	                        	                      	
	                        }
	                        seriesData.push(o);  
                        }
                        
                        var option = {
                        	    tooltip : {
                        	        trigger: 'axis',
                        	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        	            type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
                        	        }
                        	    },
                        	    legend: {
                        	        data:["非认证","达人","个人认证","机构认证"]
                        	    },
                        	    toolbox: {
                        	        show : true,
                        	        orient: 'vertical',
                        	        x: 'right',
                        	        y: 'center',
                        	        feature : {
                        	            dataView : {
                        	            	show: true, 
                        	            	readOnly: false,
                        	            	optionToContent: function(opt) {
                        	                    var axisData = opt.xAxis[0].data;
                        	                    var series = opt.series;                        	                    
                        	                    var textarea = "<div style='width: 100%; height: 100%; overflow-y:scroll;border-style: solid;border-width: 1px;font-family: monospace; font-size: 14px; line-height: 1.6rem; color: rgb(0, 0, 0); border-color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);'>";
                        	                    var table = '<table style="width:100%;height:100%;font-family: monospace; font-size: 14px; line-height: 1.6rem; color: rgb(0, 0, 0); border-color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);"><tbody><tr>'
                        	                                 + '<td></td>'
                        	                                 + '<td>' + series[0].name + '</td>'
                        	                                 + '<td>' + series[1].name + '</td>'
                        	                                 + '<td>' + series[2].name + '</td>'
                        	                                 + '<td>' + series[3].name + '</td>'
                        	                                 + '</tr>';
                        	                    for (var i = 0, l = axisData.length; i < l; i++) {
                        	                        table += '<tr>'
                        	                                 + '<td>' + axisData[i] + '</td>'
                        	                                 + '<td>' + series[0].data[i] + '</td>'
                        	                                 + '<td>' + series[1].data[i] + '</td>'
                        	                                 + '<td>' + series[2].data[i] + '</td>'
                        	                                 + '<td>' + series[3].data[i] + '</td>'
                        	                                 + '</tr>';
                        	                    }
                        	                    table += '</tbody></table>';
                        	                    textarea = textarea+table+"</div>";
                        	                    return textarea;
                        	                }
                        	            },
                        	            saveAsImage : {show: true}
                        	        },
                        	        right:60
                        	    },
                        	    calculable : true,
                        	    xAxis : [
                        	        {
                        	            type : 'category',
                        	            data : legendData
                        	        }
                        	    ],
                        	    yAxis : [
                        	        {
                        	            type : 'value'
                        	        }
                        	    ],
                        	    series : seriesData
                        	};

//                        // 为echarts对象加载数据
//                        clearTimeout(loadingTicket);
//                        loadingTicket = setTimeout(function() {
//                                myChart.hideLoading();
//                                myChart.setOption(option);
//                            },
//                            500);
                        drawStatisticChart("dep_fans_and_validate_distribution", option);
                    } else {
                        $("#dep_fans_and_validate_distribution").html("<img style='display:block;margin:60px auto 50px auto;' src='img/my/bt-nodata-now"+photo+".png' />");
                    }
                },"json");
//        });
}