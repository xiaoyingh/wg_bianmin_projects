
//发帖习惯
function netizen_fatie_xiguan(json) {
	//document.getElementById("fatie_xiguan_mydiv").removeAttribute("_echarts_instance_");
	var myChart = echarts.init(document.getElementById("fatie_xiguan_mydiv"),"macarons");
	myChart.showLoading();
           // $.post("sm_al/mod2/speechAnalysisPostingHabits", newparam_,
                //function(json) {
                    if (json != null && json != "" && json != "null" && json != "[]"&&json.length>0) {
                        var jsonData = json;//JSON.parse(json.msg);
//                        排序
//                         function down(x, y) {
//                             return (x.value < y.value) ? 1 : -1
//                         }
//                         jsonData.sort(down);
                        var legend = {
                            orient: 'vertical',
                            x: '20',

                        };
                        var data = [];
                        if (jsonData) {
                            for (var i = 0; i < jsonData.length; i++) {
                                data.push(jsonData[i].name);
                                legend.data = data;
                            }
                        }

                        var option = {
                        	color: ['#0099cb','#feae00','#17a293', '#f5761b',  '#AF3E5E','#DEAF02','#FF7F50','#FC7D01'],
                            tooltip: {
                                trigger: 'item',
                              //  formatter: "{b} : {c} ({d}%)"
                                formatter: "{a} <br/>{b} : {c} ({d}%)"
                              
                            },
                            toolbox: {
                                show : true,
                                feature : {
//                              	dataView : {show: true, readOnly: false},
                                	saveAsImage : {show: true}
                                },
                                x:'90%',
                                y:'top',
                                right:60
                            },
                            calculable: true,
                            series: [{
                                name: '',
                                type: 'pie',        
                                radius : ['50%', '70%'],

                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true,
                                            //饼图、雷达图、仪表盘、漏斗图: a（系列名称），b（数据项名称），c（数值）, d（饼图：百分比 | 雷达图：指标名称）
                                            formatter:function(a,b,c,d){
                                            	//return "{b}\n{d}%  b d"
                                            	if(d<=3){
                                            		return b+" "+d+"%"+"\n"
                                            	}
                                            	if(d>3&&d<=7.5){
                                            		return b+" "+d+"%"
                                            	}
												if(d>6){
                                            	return b+"\n"+d+"%"
                                            	}
                                            }
                                        },
//                                      labelLine: {
//                                          show: true,
//                                          length:4,
//                                          length2:1
//                                      }
                                    }
                                },
                                center: ['50%', '50%'],
                                data: jsonData
                            }]
                        };
                        drawStatisticChart("fatie_xiguan_mydiv", option);

                    } else {
                        $("#fatie_xiguan_mydiv").html("<img style='display:block;margin:60px auto 50px auto;' src='img/my/bt-nodata-now"+photo+".png' />");
                    }
               // });
//        });

}