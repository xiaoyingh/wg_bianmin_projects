function dep_location_distribution(data){
	var myChart = echarts.init(document.getElementById("map"),"macarons");
	myChart.showLoading();
	$.post("blogger/blogger_dep_location_distribution",{data : data}, function(json) {
			var data = [];
			var provinces_return=[];
			var maxNum = 0;
			for(var i=0 ; i<json.length ; i++){
				var o = {};
				o.name = json[i][0];
				o.value = Number(json[i][1]);
				if(o.value>maxNum){
					maxNum=o.value;
				}
				data.push(o);
				provinces_return.push(o.name);
			}
			if(maxNum==0){
				maxNum=10;
			}
			
			var provinces = ["北京","上海","广东","其他","浙江","江苏","河南","山东","香港","台湾","湖南","福建","辽宁","四川","重庆","湖北","安徽","天津","云南","黑龙江","山西","河北","江西","广西","吉林","甘肃","陕西","贵州","海南","新疆","西藏","澳门","内蒙古","宁夏","青海"];
			for(var i=0 ; i<provinces.length ; i++){
				var province = provinces[i];
				if($.inArray(province, provinces_return)==-1){
					var o={};
					o.name = province;
					o.value = 0;
					data.push(o);
				}
			}
			var option2 = {
					tooltip : {
						trigger: 'item'
					},
					
					dataRange: {
						min: 0,
						max: maxNum,
						x: 'left',
						y: 'bottom',
						text:['高','低'],           // 文本，默认为数值文本
						calculable : true
					},
					toolbox: {
						show: true,
						orient : 'vertical',
						x: 'right',
						y: 'center',
						feature : {
							mark : {show: true},
							dataView : {show: true, readOnly: false},
							//restore : {show: true},
							saveAsImage : {show: true}
						},
						right:60
					},
					roamController: {
						show: true,
						x: 'right',
						mapTypeControl: {
							'china': true
						}
					},
					series : [
						{
							name: '地域分布',
							type: 'map',
							mapType: 'china',
							roam: false,
							itemStyle:{
								normal:{label:{show:true}},
								emphasis:{label:{show:true}}
							},
							data:data
						}
					]
				};
									
			 drawStatisticChart("map", option2);
	},"json"
	);
}