/**
 * 网民情感波动
 * @param element_id
 * @param rid
 */
function netizens_sentiment_analysis(element_id,data) {
	//document.getElementById(element_id).removeAttribute("_echarts_instance_");
	var myChart = echarts.init(document.getElementById(element_id),"macarons");
	myChart.showLoading();
	//$.post("sm_al/mod2/speechEmotionDistribution",newparam_,function(data) {

//	            var flags = ["正面", "负面", "中立"];
	            var flags = netizens_sentiment_analysis_str['flags_zh'];
	            if (getCookie("userLanguage")) {
						flags = netizens_sentiment_analysis_str['flags_'+getCookie("userLanguage").substring(0, 2)]
					}
	            if (data != null && data != "" && data != "null" && data != "[]") {
	                var series = [];
	                var axis = [];
	                var legend = []
	                var jsonData = data;//JSON.parse(data);
	                var hasdata = false;
	                if (jsonData) {
	                	var numArr = [];
	                	var zm = 0;
	                	var fm = 0;
	                	var total_ = 0;
	                    $.each(jsonData, function(i, n) {
	                        var datas = [];
	                        var names = [];
	                        $.each(n, function(v, n) {
	                        	hasdata = true;
	                            names.push(n[0]);
	                            total_ +=Number(n[1])
	                            datas.push(Number(n[1]));
	                            numArr.push(Number(n[1]));
	                            if (i==1) {
	                            	zm +=Number(n[1])
	                            }
	                            if (i==2) {
	                            	fm +=Number(n[1])
	                            }
	                        });

	                        legend.push({
	                        	name:flags[parseInt(i)-1],
	                        	icon:'circle'
	                        })
	                        series.push({
	                            name: flags[parseInt(i)-1],
	                            type: 'line',
	                            data: datas,
	                            markPoint: {
	                                data: [
	                                    {type: 'max', name: '最大值'},
	                                    {type: 'min', name: '最小值'}
	                                ]
	                            },
	                            markLine: {
	                                data: [
	                                    {type: 'average', name: '平均值'}
	                                ]
	                            }
	                        })
	                        axis.push(names);
	                    });
	                    num=Math.max.apply(null, numArr)*2.5;
	                    if (total_ == 0) {
	                    	var qgz = 0
	                    }else{
	                    	var qgz = (zm-fm)/total_*100
	                    }
	                    
	                    load_emotion_fenbu(Math.round(qgz))
	                }
	                if(!hasdata){
	                	$(document.getElementById(element_id)).html("<img style='display:block;margin:60px auto 50px auto;' src='img/my/bt-nodata-now"+photo+".png' />");
	     	            return;
	                }
	                console.log(legend)
	                var option = {
	                    color: ['#0099cb', '#EE4C3D', '#91C7AE'],
	                    tooltip: {
	                        trigger: 'axis',
//	                        show:false
	                    },
	                    legend: {
	                        show: true,
	                        orient:'vertical',
	                        data: legend,
	                        right:0,
	                        top:80
	                    },
	                    toolbox: {
	                        show: true,
	                        feature: {
//	                        	dataView : {show: true, readOnly: false},
	                        	saveAsImage : {show: true}
	                        },

                            right:90
	                    },
	                    grid:{
	                    	left:50,
	                    	right:100,
	                    	bottom:60,
	                    	top:50,
	                    },
	                    dataZoom: {
	                        show: true,
	                        start: 0,
							width:680,
							left:80
	                    },
	                    xAxis: {
	                        type: 'category',
	                        boundaryGap: true,
	                        data: axis[0]
	                    },
	                    yAxis: {
//	                    	max:num,
	                        type: 'value',
//	                        minInterval:1
	                    },
	                    series: series,
	                    calculable: true
	                };

	                drawStatisticChart(element_id, option);
	            } else {
	                $(document.getElementById(element_id)).html("<img style='display:block;margin:60px auto 50px auto;' src='img/my/bt-nodata-now"+photo+".png' />");
	            }
	       // })
}