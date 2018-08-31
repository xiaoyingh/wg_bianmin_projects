function netizen_fatie_qushi(json) {
	//document.getElementById("fatie_qushi_mydiv").removeAttribute("_echarts_instance_");
	var myChart = echarts.init(document.getElementById("fatie_qushi_mydiv"),"macarons");
		myChart.showLoading();
					if(json==""){
						 $("#fatie_qushi_mydiv").html("<img style='display:block;margin:60px auto 50px auto;' src='img/my/bt-nodata-now"+photo+".png' />");
						 return;
					}
            		json = $.parseJSON(json);
                    if (!iFunc.isEmpty(json)&&json!="null"&&json!="{}") {
                        var series = [];
                        var jsonData = json;

                        if (jsonData ) {
                        	var allName =new Array();
                        	var datas=[];
	                        var time = []; //存放时间
	                       	var hasdata = false;
	                       	//遍历获取时间
	                       	$.each(jsonData,function(key,value){
	                       		if(time.length==0){
		                       		$.each(value,function(i, n) {
		                       			time.push(i);
	                        		});
	                       		}
	                       	});
	                       	//遍历获取值
	                       	$.each(jsonData,function(key,value){
	                       		hasdata = true;
	                       		var name = key; 			//名字
	                        	allName.push(name);
                        		var datas = value;//JSON.parse(jsonData[j][1]);    	//值  也就是发帖数
                        		var vfu = [];
								//把相应数据存入     对n.name 判断   取type时间段的value值得和
                        		$.each(datas,function(i, n) {
                       				vfu.push(n);
                        		});
                        		series.push({
                                     name: name,
                                     type: 'line',
                                     data: vfu,
                                     //symbolSize:2,
                                     showAllSymbol:true,
                                     symbol:'circle',
                                     itemStyle : { normal: {label : {show: false}}},// 设置是否显示数字
                                });
	                       	});
	                       	if(!hasdata){
	                       		$("#fatie_qushi_mydiv").html("<img style='display:block;margin:60px auto 50px auto;' src='img/my/bt-nodata-now"+photo+".png' />");
	                       		return;
	                       	}
                        }
                        //配置
                        option = {
                        	color: ['#FF7F50','#87CEFA', '#DA70D6', '#32CD32', '#6495ED','#FF69B4'],

                            tooltip: {    //提示框  交互时的信息提示
                                trigger: 'axis',
                                show : true,
                                x:'90%',
                                y:'top'
                            },
                            grid:{
                            	backgroundColor:'rgba(245, 245, 245,0)',
                            	borderWidth:2,
                            	bottom: 80,
                            	top: 20
                            },
                            toolbox: {			//工具箱   默认不开启
                                show: true,
                                feature: {
//                              	dataView : {show: true, readOnly: false},
                                	saveAsImage : {show: true}
                                },

                                right:70,
                                top:-5
                            },
                            dataZoom: {    //数据区域显示
                            	show: true,
                                realtime: true,
                                start: 0,
                                end: 100,
                                width:"78%",
                                 x:"72px"

                            },
                            xAxis: [{		//X坐标数据
                            	type : 'category',
                                boundaryGap : false,
                                data : time
                            }],
                            yAxis: [{
                            	name:"",
                                type: 'value',		//y轴显示类型是值
                                minInterval:1
                            }],
                            series: series,			//对应得 名字 类型 类型值  与 legend name 自动匹配

                            calculable: true
                        };
                        drawStatisticChart("fatie_qushi_mydiv", option);
                    } else {
                        $("#fatie_qushi_mydiv").html("<img style='display:block;margin:60px auto 50px auto;' src='img/my/bt-nodata-now"+photo+".png' />");
                    }

//        });
}