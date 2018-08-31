var searchty = 0;
var keydownArtSource="";//稿件来源，下拉列表中如果没有对应的值，则通过回车获取相应的文本，传递到后台进行检索 LXH 
var keydownSigndep="";//签发部门，下拉列表中如果没有对应的值，则通过回车获取相应的文本，传递到后台进行检索 LXH 
var tabOn = 0;
var mpageNo = 1;//分批加载媒体	
var qjData = {};
var orderflag = 0;
var sysName_crossMedia = 'tradition_al';
var type=0;
function init () {
	// 高级检索和返回按钮
	$(".condition_container_simple").find(".return_common").unbind("click").click(function() {
		$(".condition_container_simple").hide();
		$(".condition_container_advance").show();
		conditionOperateInit();
	});
	$(".condition_container_advance").find(".return_common").unbind("click").click(function() {
			  
		$(".condition_container_simple").show();
		$(".condition_container_advance").hide();
	});
	//检索按钮
	//1. 普通检索
	$(".condition_container_simple").find(".search_info_other_submit_top").unbind("click").click(function(){
		orderflag = 0;
		searchty = 0
		TraditionalData()
	});
	//2. 高级检索
	$(".condition_container_advance").find(".search_info_other_submit_1").unbind("click").click(function(){
		orderflag = 0;
		searchty = 1
		TraditionalData()
	});
	initialInfoTime_top()
	initialInfoTime()
	TraditionalData();
	$('.custom-selectMenu a').unbind('click').on('click',function (){
		var oBy = $(this).attr('val');
		var oHtml = $(this).html();
		if (oBy == 1){
			$('.custom-selectTitle').html(oHtml+' <span class="caret"></span>');
			$('.custom-inputSelect').attr('id','info_title');
		} else if (oBy == 2){
			$('.custom-selectTitle').html(oHtml+' <span class="caret"></span>');
			$('.custom-inputSelect').attr('id','info_content');
		}else if (oBy == 3){
			$('.custom-selectTitle').html(oHtml+' <span class="caret"></span>');
			$('.custom-inputSelect').attr('id','info_titlecontent');
		}
	});
	$('.custom-selectMenu1 a').unbind('click').on('click',function (){
		var oBy = $(this).attr('val');
		var oHtml = $(this).html();
		if (oBy == 1){
			$('.custom-selectTitle1').html(oHtml+' <span class="caret"></span>');
			$('.custom-inputSelect1').attr('id','info_title1');
		} else if (oBy == 2){
			$('.custom-selectTitle1').html(oHtml+' <span class="caret"></span>');
			$('.custom-inputSelect1').attr('id','info_content1');
		}else if (oBy == 3){
			$('.custom-selectTitle1').html(oHtml+' <span class="caret"></span>');
			$('.custom-inputSelect1').attr('id','info_titlecontent1');
		}
	});
	loadArtSource_(-1)
		
	//传统采用家次详细页
	$(".detail_adopt_info").load("/detail/detail_adopt_info_crossmedia.html");
	//微信采用家次详细页
	$(".detail_wechatadopt_info").load("/detail/detail_wechatadopt_info_crossmedia.html");
	//客户端采用家次详细页
	$(".detail_appadopt_info").load("/detail/detail_appadopt_info_crossmedia.html");

}


//签发时间初始化
function initialInfoTime_top() {
	var ttime = moment().subtract(7, 'days').format('YYYY-MM-DD') + '至'
			+ moment().format('YYYY-MM-DD');
	$("#info_time_range_top span").text(ttime);

	var cb2 = function(start, end, label) {
		var stime = start.format('YYYY-MM-DD');
		var etime = end.format('YYYY-MM-DD');
		if (label == '不限') {
			$(".one_day_search").hide();
			$('#info_time_range_top span').html('');
		} else {
			if (label == '自定义' && stime != etime) {
				$(".one_day_search").hide();
			} else {
				$(".one_day_search").show();
			}
			$('#info_time_range_top span')
					.html(
							start.format('YYYY-MM-DD') + '至'
									+ end.format('YYYY-MM-DD'));
		}
	}
	var optionSet2 = {
		startDate : moment().subtract(7, 'days'),
		endDate : moment(),
		minDate : moment().subtract(6, 'year'),
		timePicker : false,
		timePickerIncrement : 1,
		timePicker12Hour : true,
		ranges : {
			'不限' : [ '' ],
			'三月' : [ moment().subtract(3, 'months'), moment() ],
			'一月' : [ moment().subtract(1, 'months'), moment() ],
			'一周' : [ moment().subtract(7, 'days'), moment() ]
		},
		opens : 'right',
		buttonClasses : [ 'btn btn-default' ],
		applyClass : 'btn-small btn-primary',
		cancelClass : 'btn-small',
		format : 'YYYY-MM-DD',
		separator : '至',
		locale : {
			applyLabel : '确定',
			cancelLabel : '关闭',
			fromLabel : '开始时间',
			toLabel : '结束时间',
			customRangeLabel : '自定义',
			daysOfWeek : [ '七', '一', '二', '三', '四', '五', '六' ],
			monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月',
					'九月', '十月', '十一月', '十二月' ],
			firstDay : 1
		}
	};

	$('#info_time_range_top').daterangepicker(optionSet2, cb2);
}
function initialInfoTime() {
	var ttime =  moment().subtract(7, 'days').format('YYYY-MM-DD') + '至'
			+ moment().format('YYYY-MM-DD');
	$("#info_time_range_1 span").text(ttime);

	var cb2 = function(start, end, label) {
		var stime = start.format('YYYY-MM-DD');
		var etime = end.format('YYYY-MM-DD');
		if (label == '不限') {
			$(".one_day_search").hide();
			$('#info_time_range_1 span').html('');
		} else {
			if (label == '自定义' && stime != etime) {
				$(".one_day_search").hide();
			} else {
				$(".one_day_search").show();
			}
			$('#info_time_range_1 span')
					.html(
							start.format('YYYY-MM-DD') + '至'
									+ end.format('YYYY-MM-DD'));
		}
	}
	var optionSet2 = {
		startDate : moment().subtract(7, 'days'),
		endDate : moment(),
		minDate : moment().subtract(6, 'year'),
		timePicker : false,
		timePickerIncrement : 1,
		timePicker12Hour : true,
		ranges : {
			'不限' : [ '' ],
			'三月' : [ moment().subtract(3, 'months'), moment() ],
			'一月' : [ moment().subtract(1, 'months'), moment() ],
			'一周' : [ moment().subtract(7, 'days'), moment() ]
		},
		opens : 'right',
		buttonClasses : [ 'btn btn-default' ],
		applyClass : 'btn-small btn-primary',
		cancelClass : 'btn-small',
		format : 'YYYY-MM-DD',
		separator : '至',
		locale : {
			applyLabel : '确定',
			cancelLabel : '关闭',
			fromLabel : '开始时间',
			toLabel : '结束时间',
			customRangeLabel : '自定义',
			daysOfWeek : [ '七', '一', '二', '三', '四', '五', '六' ],
			monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月',
					'九月', '十月', '十一月', '十二月' ],
			firstDay : 1
		}
	};

	$('#info_time_range_1').daterangepicker(optionSet2, cb2);
}
function findSize(){
	 var size= 20;
//	 if(!iFunc.isEmpty(size)){
//		 var size=parseInt(size);
//		 if(size>0&&size<=200){
//			 return size;
//		 }else if(size>200){
//			 alert("每页显示最大支持200条");
//			 $("#info_pageSize").html(200);
//			 return 0;
//		 }else{
//			 alert("每页显示输入错误");
//			 return 0;
//		 }
//	 }
	return size;
}

function thorder_click_init(){
	//排序按钮初始化
	$('.thorder').unbind("click").click(function(){
		var $ch = $(this).find("[name^='art_search_flag']");
		if($(this).attr("triggerClick")==null){
			$(this).attr("triggerClick","y");
		}else{
			//$(this).removeAttr("triggerClick");
		}
		art_info_sort($ch);
	});
}

//排序

function art_info_sort(data){	    
	var c=data.attr("class");
	if(c=="fa fa-sort"){
		data.attr("class","fa fa-sort-down");
	}else if(c=="fa fa-sort-down"){
		data.attr("class","fa fa-sort-up");
	}else if(c=="fa fa-sort-up"){
		data.attr("class","fa fa-sort-down");
	}
	data.closest("th").siblings().find("[name^='art_search_flag']").attr("class","fa fa-sort");
	
	orderflag = 1;//点击排序时，不刷新多维度
	TraditionalData();
}

function analysisData () {
	var artSearchVo = null;
	var adoptSearchVo = getAdoptSearchVo();
	if (searchty == 0) {// 普通检索
		artSearchVo = getCommonArtSearchVo();
	} else {// 高级检索
		artSearchVo = getArtSearchVo();
	}
	var data = {};
	for ( var key in artSearchVo) {
		data["artSearchVo." + key] = artSearchVo[key];
	}
	for ( var key in adoptSearchVo) {
		data["adoptSearchVo." + key] = adoptSearchVo[key];
	}
	return data;
}

function TraditionalData() {
	
	var artSearchVo = null;
	var adoptSearchVo = getAdoptSearchVo();
	var flag = $("[name^='art_search_flag'].fa-sort-down,.fa-sort-up,.fa-sort");
	$(".thorder").unbind("click");
	if (searchty == 0) {// 普通检索
		artSearchVo = getCommonArtSearchVo();
	} else {// 高级检索
		artSearchVo = getArtSearchVo();
		flag.show();
	}
	thorder_click_init();
	var data = {};
	for ( var key in artSearchVo) {
		data["artSearchVo." + key] = artSearchVo[key];
	}
	for ( var key in adoptSearchVo) {
		data["adoptSearchVo." + key] = adoptSearchVo[key];
	}
	data["searchty"] = 1;// 0 普通检索 1 高级检索 -1 ,还未点击搜索
	var option = new Object();
	option.param = data;
	option.pageSize = findSize();
	option.operBtnHtml = " ";
	option.isExport = false;
	option.callback = function() {
		
		var mediaType = 0;// 媒体类别
		var isRegion = 0; // 境内外
		var isClub = 0; // 社内外
		var display = "";
		if (mediaType == 1) {
			display = "网媒 ";
		} else if (mediaType == 3) {
			display = "通讯社 ";
		} else if (mediaType == 4) {
			display = "广电媒体 ";
		} else if (mediaType == 5) {
			display = "纸质媒体 ";
		} else if (mediaType == 6) {
			display = "重点媒体 ";
		}
		if (isRegion == 1) {
			display += "境内媒体";
		} else if (isRegion == 2) {
			display += "境外媒体";
		}
		if (isClub == 1) {
			display += "社内";
		} else if (isClub == 2) {
			display += "社外";
		}
		$("[name='correspondingLabel']").html(display);
		// 列表配置初始化
		var obj = $(".iToolbar_container");

		loadArtInfoByIds();// 详细信息
		// 传统采用家次详细信息
		$("[name='detail_adopt']").unbind("click").click(
				function() {
					artid = $(this).attr("data-id");
					arttitle = $(this).parent("td").parent("tr").find(
							"[name=mtitle1]").html();
					loadAdoptDetailInfo(artid);
				});
		// 微信采用家次详细信息
		$("[name='detail_wechatadopt']").unbind("click").click(function() {
			var id = $(this).attr("data-id");
			loadWechatAdoptDetailInfo(id);
		});
		// 客户端采用家次详细信息
		$("[name='detail_appadopt']").unbind("click").click(function() {
			var id = $(this).attr("data-id");
			loadAppAdoptDetailInfo(id);
		});

		$("[name='info_artinfo']").unbind("click").click(function() {
			check_source_box("info_artinfo");
		})

		selectAll();

		// 图片放大
		$("[name='artImage']").unbind("click").click(function() {
			var url = $(this).attr("src");
			$("[name='imagedetailPath']").attr("src", url);
		});
		
//		hideColumn();
//		tooltipsterInit($("[name='artImage']"));
//		//列表显示配置初始化
//		iColumnInitShow();

	};
	var url = '/tradition_al/mod1/load_artInfo_all'
	var obj = new iPageT.PageLoad("tra_info_list_info", url, option).init();
	
	//点击排序时不刷新多维度
	if(orderflag==0){
		//暂时隐藏 多维度
		$('.analysis').load('/page/tradition_al/dynamic/analysis.html')
	}
	
}
function getCommonArtSearchVo() {
	var artSearchvo = {};
	var title = "";
	var content = "";
	var titlecontent = "";
	if ($('.custom-inputSelect').attr("id") == "info_title") {
		title = $("#info_title").val(); // 标题
	} else if ($('.custom-inputSelect').attr("id") == "info_content") {
		content = $("#info_content").val(); // 全文
	} else if ($('.custom-inputSelect').attr("id") == "info_titlecontent") {
		titlecontent = $("#info_titlecontent").val(); // 标题或全文
	}
	var artSource = $("#info_source_").find("option:selected").val();// 稿件来源
	//签发时间
	var timeStr = $("#info_time_range_top span").text();
	if (timeStr != "") {
		timeStr = timeStr.replace("至", "#");
	}
	artSearchvo.titleStr = title;// 标题
	artSearchvo.contentStr = content;// 正文
	artSearchvo.titleOrContentStr = titlecontent;// 正文
	
	artSearchvo.artSource = artSource;
	artSearchvo.timeStr = timeStr;
	
	// 排序的标记
	var orderStr = "adoptCount_desc";
	var flag = $("[name^='art_search_flag'].fa-sort-down,.fa-sort-up");
	var names = flag.attr("name");
	var name = names.split("_");
	var stype = flag.attr("class");
	if (stype.indexOf("down") != -1) {
		orderStr = name[name.length - 1] + "|" + "desc";
	} else if (stype.indexOf("up") != -1) {
		orderStr = name[name.length - 1] + "|" + "asc";
	}
	artSearchvo.orderStr = orderStr;
	return artSearchvo;

}

// 封装ArtSearchVo 对象
function getArtSearchVo() {
	var artSearchvo = {};
	var artSource = $("#info_source").find("option:selected").val();// 稿件来源

	var title = "";
	var content = "";
	var titlecontent = "";
	if ($('.custom-inputSelect1').attr("id") == "info_title1") {
		title = $("#info_title1").val(); // 标题
	} else if ($('.custom-inputSelect1').attr("id") == "info_content1") {
		content = $("#info_content1").val(); // 全文
	} else if ($('.custom-inputSelect1').attr("id") == "info_titlecontent1") {
		titlecontent = $("#info_titlecontent1").val(); // 标题或全文
	}
	var author = $("#info_author").val();
	var timeStr = $("#info_time_range_1 span").text();
	if (timeStr != "") {
		timeStr = timeStr.replace("至", "#");
	}
	var isOrigin = $('[name=event_radio].active').attr('value')
	artSearchvo.artSource = artSource;// 稿件来源
	artSearchvo.titleStr = title;// 标题
	artSearchvo.contentStr = content;// 正文
	artSearchvo.titleOrContentStr = titlecontent;// 正文
	artSearchvo.author = author;// 记者
	artSearchvo.timeStr = timeStr;
	artSearchvo.isOrigin = isOrigin;//是否原创
	// 排序的标记
	var orderStr = "adoptCount_desc";
	var flag = $("[name^='art_search_flag'].fa-sort-down,.fa-sort-up");
	var names = flag.attr("name");
	var name = names.split("_");
	var stype = flag.attr("class");
	if (stype.indexOf("down") != -1) {
		orderStr = name[name.length - 1] + "|" + "desc";
	} else if (stype.indexOf("up") != -1) {
		orderStr = name[name.length - 1] + "|" + "asc";
	}
	artSearchvo.orderStr = orderStr;
	return artSearchvo;
}

//封装AdoptSearchVo 对象
function getAdoptSearchVo(){
	var adoptSearchVo={};
 	var mediaType = $("#info_adopt_type").find("option:selected").val();//媒体类别
	var mediaId = $("#info_adopt_media_cross").val();//采用媒体		//采用时间，  在采用媒体不是全部，不是空的时候，后台查询
	
	adoptSearchVo.mediaType=mediaType;
	if(mediaId!=null){
		adoptSearchVo.mediaIds=mediaId.join(",");
	}
	return adoptSearchVo;
}


//缓加载其余信息
function loadArtInfoByIds(containerId){
	var checkbox_temp = "";
	$("input:checkbox[name='info_artinfo']").each(function() {
		if($(this).val()!=-1){
			checkbox_temp += ","+$(this).val();
		}
	});
	if(checkbox_temp!=null && checkbox_temp!="" && checkbox_temp.length>0){
		checkbox_temp = checkbox_temp.substring(1);
		if(searchty==0){//普通检索
			artSearchVo = getCommonArtSearchVo();
			if(tabOn==3){
				artSearchVo.titleStr = "";//模糊检索
			}
		}else{//高级检索
			artSearchVo=getArtSearchVo();
		}
		var data={};	 
		for ( var key in artSearchVo) {
				data["artSearchVo." + key] = artSearchVo[key];
		}
		data["ids"]=checkbox_temp;
		$.post("/tradition_al/mod1/loadExtraArtInfoByIds",data,function(d){//包括阅读量点赞量回复量的异步加载
			if(d){
				$.each(d,function(i,val){
					var artId=val.artid;
					var artTr=$("#tra_info_list_info").find("tr[name='art_id_"+artId+"']");
					if(containerId!=null && containerId!=""){
						artTr = $("#"+containerId).find("tr[name='art_id_"+artId+"']");
					}
					artTr.find("[name='art_artSource']").html(val.sourceName);
					if(!iFunc.isEmpty(val.signDep)&&val.signDep!="null"){
						artTr.find("[name='art_signDep']").html(val.signDep);
					}				
					artTr.find("[name='art_signLine']").html(val.displaysignLine);
					artTr.find("[name='art_author']").html(val.displayauthor);
					artTr.find("[name='art_authorType']").html(val.displayauthorType);
					
					 artTr.find(".art_wechatreviewcount").html("<p style='margin:0px;' title="+val.reviewcount+">"+processDataNum(val.reviewcount)+"</p>");
					 artTr.find(".art_wechatupcount").html("<p style='margin:0px;'  title="+val.upcount+">"+processDataNum(val.upcount)+"</p>");
					 artTr.find(".art_appreply").html("<p style='margin:0px;'  title="+val.replycount+">"+processDataNum(val.replycount)+"</p>");
				});
			}
		});
	}
};
function selectAll(){
	$(".select_all").unbind("click").click(function(){
		if($(this).attr("checked")=="checked"){ $(".select_all").prop("checked",false).attr("checked",false);   $("[name=info_artinfo]").prop("checked",false).attr("checked",false);}
		else{$(".select_all").prop("checked",true).attr("checked",true);  $("[name=info_artinfo]").prop("checked",true).attr("checked",true);}
	});
};
function check_source_box(type) {
	var flag = true;
	var count = 0;
	$("input[name='" + type + "']").each(function() {
		if ($(this).val() != -1) {
			if ($(this).is(":checked")) {
				count++;
			} else {
				flag = false;
			}
		}
	});
	if (flag) {
		$(".select_all").prop("checked", true);
	} else {
		$(".select_all").prop("checked", false);
				
	}
}

function conditionOperateInit() {
	setParam(1);
//	loadBoard();// 版块初始化, 依次加载 稿件类型，签发部门 稿件来源，，最后加载数据
//	loadArtType();
//	loadSignDep_top();
//	loadSignDep();// 签发部门初始化
	mpageNo = 1;//分页加载媒体
	loadMediaInfo(0,mpageNo,null,null);//采用媒体初始化
	loadArtSource(-1);// 稿件来源初始化
	loadArtSource_(-1);// 稿件来源初始化
	bidAndTypeAndMedialinkage();
	$("#info_author").val("");
}
function setParam(datatype) {
	$(".kws_input").val("");
	$("#search_kws").val("");
	$('#info_adopt_type').val(0)
//	var ytime = moment().subtract(7, 'days').format('YYYY-MM-DD') + '至'
//			+ moment().format('YYYY-MM-DD');
//	$("#info_time_range_" + datatype + " span").text(ytime);
	initialInfoTime_top()
	initialInfoTime()
}
// 稿件来源初始化
function loadArtSource(pid) {
	$("#info_source").empty();
//		var option = $("<option value='0'>全部</option><option value='-2'>空</option>");
		var option = $("<option value='0'>全部</option>");
	$("#info_source").append(option);
	$.post("/" + sysName_crossMedia + "/mod1/loadArtSource", {
		"pid" : pid
	}, function(data) {
		if (!iFunc.isEmpty(data) && data.length > 0) {
			var str = "";
			$.each(data, function(i, val) {
				str += "<option value='" + val.id + "'>" + val.name
						+ "</option>";
			});
			$("#info_source").append(str);
			$("#info_source").trigger("chosen:updated");
			$("#info_source").chosen();
		}
		searchty = 1;
	});
}
// 分报稿件来源初始化
function loadArtSource_(pid) {
	$("#info_source_").empty();
//	var option = $("<option value='0'>全部</option><option value='-2'>空</option>");
	var option = $("<option value='0'>全部</option>");
	$("#info_source_").append(option);
	$.post("/" + sysName_crossMedia + "/mod1/loadArtSource", {
		"pid" : pid
	}, function(data) {
		if (!iFunc.isEmpty(data) && data.length > 0) {
			var str = "";
			$.each(data, function(i, val) {
				str += "<option value='" + val.id + "'>" + val.name
						+ "</option>";
			});
			$("#info_source_").append(str);
			$("#info_source_").trigger("chosen:updated");
			$("#info_source_").chosen();
		}
		searchty = 1;
	});
}
//输入字符串时，后台查询匹配的所有媒体
var manualSearch = null;
var kwsadoptmedia = null;

// 版块 媒体类别 联动 触发媒体加载
function bidAndTypeAndMedialinkage() {
	$("#info_adopt_type").change(function() {
		type = $(this).val();
		mpageNo = 1;
		loadMediaInfo(type,mpageNo,null,null);
	});
}

function inputkeydown(){
	var $sinput = $(".adopt_media_divs li.search-field>input");
	$sinput.keydown(function(event){
		var keyCode = event.keyCode;
		
		setTimeout(function(){
			kwsadoptmedia = $sinput.val();
			//console.log("input---9999999-"+kwsadoptmedia);
			if(kwsadoptmedia!=null && kwsadoptmedia!=""){
				if(keyCode=="13"){
					mpageNo = 1;
					manualSearch = "search";
					loadMediaInfo(type,mpageNo,manualSearch,kwsadoptmedia);//默认查100，可满足需求
				}
				
			}else{
				manualSearch=null;
			}
			
		},100);
	});
	
}

//定时查看是否，滚动轴到最后，  最后一个媒体高亮时在加载
 setInterval(function(){
	 var $sinput = $(".adopt_media_divs li.search-field>input");
	 kwsadoptmedia = $sinput.val();
	 var lenli = $(".adopt_media_divs li.active-result").length;
	/* console.log(lenli+"--------------lenli");
	 console.log(kwsadoptmedia+"--------------kwsadoptmediasss");*/
	 if(lenli>0 &&   (kwsadoptmedia==null||kwsadoptmedia=="")){
		 
		 var mclass = $(".adopt_media_divs li.active-result:eq("+(lenli-1)+")").attr("class");
		 if(mclass!=null && mclass.indexOf("highlighted")>0){//最后一个媒体高亮时，加载下一页
			 mpageNo = mpageNo+1;
			 loadMediaInfo(type, mpageNo);
		 }
	 }
},500);
function  loadMediaInfo(type,mpageNo,manualSearch,kwsadoptmedia){
	if(mpageNo==1 && manualSearch==null){
		$("#info_adopt_media_cross").empty();
		$("#info_adopt_media_cross").chosen("destroy");
//		var option = $("<option value='0'>全部</option><option value='-2'>空</option>");
		var option = $("<option value='0'>全部</option>");
		$("#info_adopt_media_cross").append(option);
	}
	$.post("/" + sysName_crossMedia + "/mod1/loadMediaInfo", {
		"type" : type,
		"kws":kwsadoptmedia,
		"pageNo":mpageNo,
		"pageSize":100
	}, function(data) {
	
		if (!iFunc.isEmpty(data) && data.length > 0) {
			
			var lenli = $(".adopt_media_divs  li.active-result").length;
			
			var str = "";
			var appresult = "";
			$.each(data, function(i, val) {
				 str += "<option value='" + val.id + "'>" + val.name
						+ "</option>"; 
				 appresult += '<li class="active-result" data-option-array-index="'+lenli+'">'+val.name+'</li>';
				 lenli++;
			});
				$("#info_adopt_media_cross").append(str);
				$("#info_adopt_media_cross").trigger("chosen:updated"); 
				$('#info_adopt_media_cross').chosen({
					no_results_text : "未找到此选项!",
				})
			inputkeydown();//手动输入 method
		} else {
			if(mpageNo==1 && manualSearch==null){
				$("#info_adopt_media_cross").trigger("chosen:updated");
				$('#info_adopt_media_cross').chosen({
					no_results_text : "未找到此选项!",
				})
			} 
		}
	})
	
}




//传统 采用家次详细信息
function loadAdoptDetailInfo(id){
	var adoptSearchVo=getAdoptSearchVo();
	var data={};	 
	for ( var key in adoptSearchVo) {
		  data["adoptSearchVo." + key] = adoptSearchVo[key];
	}
	data["id"]=id;
	$('#adopt_info_list').find("tbody").empty().html("<tr><td colspan='9'><div style='line-height:80px;'><span class='page_loading'></span>正在努力加载...</div></td></tr>");
	var t=$('#adopt_info_list').DataTable({
		"language":{
			"url":"/js/plugins/dataTables/datatables_zh_CN.json"
		},
		"destroy":true ,
		"ajax": {
		        url: "/"+sysName_crossMedia+"/mod4/loadAdoptDetailInfo_traditional",
		        data: data 
		 },
		 columnDefs:[{
             orderable:false,//禁用排序
             targets:[0,6]   //指定的列
         }],
         "aaSorting": [[ 5, "desc" ]],
		 "columns" : [ 
                      {data:null},
		              { data : null,
						render: function(data, type, row) {
							return '<a class=\'title1\' href='+data.url+'  target=\'_blank\' title='+data.title+'>'+data.title+'</a>';
					     },
		              },
		              { data : null,
						render: function(data, type, row) {
							return '<span class=\'name1\' title='+data.name+'>'+data.name+'</span>';
					     },
		              },
		              { data : null,
						render: function(data, type, row) {
							return '<span class=\'type1\'>'+data.type+'</span>';
					     },
		              },
		              { data : null,
						render: function(data, type, row) {
							return '<span class=\'region\'>'+data.region+'</span>';
					     },
		              },
//		              { data : null,
//						render: function(data, type, row) {
//							return '<span class=\'club1\'>'+data.club+'</span>';
//					     },
//		              },
		              {
		            	  data:null,
		            	  render:function(data,type,row){
		            	  	if (data.medialevel=='中央级和中字头') {
		            	  		return 5;
		            	  	}else if (data.medialevel=='省级媒体') {
		            	  		return 4;
		            	  	}else if (data.medialevel=='地市级媒体') {
		            	  		return 3;
		            	  	}else if (data.medialevel=='晚报都市报') {
		            	  		return 2;
		            	  	}else if (data.medialevel=='') {
		            	  		return 0;
		            	  	}else{
		            	  		return 1;
		            	  	}
		            	  }
		              },
		              {
		            	  data:null,
		            	  render:function(data,type,row){
		            		  return data.medialevel;
		            	  }
		              },{
		            	  data:null,
//		            	  render:function(data,type,row){
//		            		  return data.boardindex;
//		            	  }
//		              },
//		              { data : null,
						render: function(data, type, row) {
							return '<span class=\'pubtime1\'>'+data.pubtime+'</span>';
					     },
		              }
				 ],
				 "fnDrawCallback" : function() {
					 $('.delMedia').unbind("click").click(function () {
						   if(confirm("确定删除吗？")){
							   var id = $(this).data('aid');
								var mid =  $(this).data('mid');
								$.get("/"+sysName_crossMedia+"/mod5/cancelRelate",{artid:id,mid:mid},function(d){
									if(d=="ok"){  
										loadAdoptDetailInfo(id);
									}
								}); 
						   }
							
					});
				 }
	});
	t.on( 'order.dt search.dt', function () {
        t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        } );
    } )
    //.draw()
    //采用媒体
    loadAdoptMediaType(data,$("#div_adopt_media"),"/"+sysName_crossMedia+"/mod4/loadAdoptDetailInfo_traditional",1);
}

//采用媒体  区分境内外
function loadAdoptMediaType(data,$div,url){
	$.get(url,data,function(d){
			processAdoptMedia(d,$div);
	});
}
function processAdoptMedia(data,$div){
	var mlist1 = [];
	var mlist2 = [];
 	var namelist = [];
	$.each(data.data,function(i,n){
		var flag = isExist(namelist,n.name);
		if(flag==0){//不存在
			if(n.region=="境内"){
				mlist1.push('<button class="btn btn-default " type="button" style="cursor: initial;border: 1px solid #5684a3;line-height: 15px;margin-bottom: 10px">'+n.name+'</button>&nbsp;&nbsp;');
			}else if(n.region=="境外"){
				mlist2.push('<button class="btn btn-default " type="button" style="cursor: initial;border: 1px solid #5684a3;line-height: 15px;margin-bottom: 10px">'+n.name+'</button>&nbsp;&nbsp;');
			}
			namelist.push(n.name);
		}
	});
	$div.find("div:eq(0)").html(mlist1);
	$div.find("div:eq(1)").html(mlist2);
}
 function isExist(mlist,name){
	var flag = 0;
	$.each(mlist,function(i,n){
		if(n==name){
			flag = 1;
			return flag;
		}
	});
	return flag;
} 
//微信 采用家次详细信息
function loadWechatAdoptDetailInfo(id){
	var data={};	 
	/*for ( var key in adoptSearchVo) {
		  data["adoptSearchVo." + key] = adoptSearchVo[key];
	}*/
	data["id"]=id;
	$('#wechatadopt_info_list').find("tbody").empty().html("<tr><td colspan='6'><div style='line-height:80px;'><span class='page_loading'></span>正在努力加载...</div></td></tr>");
	var t=$('#wechatadopt_info_list').DataTable({
		"language":{
			"url":"/js/plugins/dataTables/datatables_zh_CN.json"
		},
		"destroy":true ,
		"ajax": {
		        url: "/"+sysName_crossMedia+"/mod4/loadAdoptDetailInfo_wechat?type=1",
		        data: data 
		 },
		 //"deferRender": true,
		 columnDefs:[{
             orderable:false,//禁用排序
             targets:[0,0]   //指定的列
         }],
         "aaSorting": [[ 1, "desc" ]],
		 "columns" : [ 
                      {data:null},
		              { data : null,
						render: function(data, type, row) {
							return '<a href='+data.url+'  target=\'_blank\' class=\'title2\' title='+data.title+'>'+data.title+'</a>';
					     },
		              },
//		              { "data" : "name"},
		              { data : null,
						render: function(data, type, row) {
							return '<span class=\'name2\' title='+data.name+'>'+data.name+'</span>';
					     },
		              },
		              { data : null,
						render: function(data, type, row) {
							if (data.reviewcount!=null) {
								return data.reviewcount;
							}else{
								return 0;
							}
							
					     },
		              },
		              { data : null,
						render: function(data, type, row) {
							if (data.upcount!=null) {
								return data.upcount;
							}else{
								return 0;
							}
							
					     },
		              },
//		              { "data" : "reviewcount"},
//		              { "data" : "upcount"}, 
		              { "data" : "pubtime"}
				 ],
				 "fnDrawCallback" : function() {
					 $('.delWechat').unbind("click").click(function () {
						   if(confirm("确定删除吗？")){
							   var id = $(this).data('aid');
								var wid =  $(this).data('wid');
								$.get("/"+sysName_crossMedia+"/mod1/cancelWechatRelate",{artid:id,cawid:wid},function(d){
									if(d=="ok"){  
										alert("删除成功");
										loadWechatAdoptDetailInfo(id);
									}
								}); 
						   }
							
					});
					 //采用的微信公众号
					 loadAdoptMedia(data,$("#div_adopt_wechat"),"/"+sysName_crossMedia+"/mod4/loadAdoptDetailInfo_wechat?type=1");
				 }
	});
	t.on( 'order.dt search.dt', function () {
        t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        } );
    } )
    //.draw()
}

//采用微信公众号，app账号
function loadAdoptMedia(data,$div,url){
	$.get(url,data,function(d){
		processAdoptMediaOrAccount(d,$div);
	});
}
function processAdoptMediaOrAccount(data,$div){
 	var mlist = [];
 	var namelist = [];
	$.each(data.data,function(i,n){
		var flag = isExist(namelist,n.name);
		if(flag==0){//不存在
			mlist.push('<button class="btn btn-default " type="button" style="cursor: initial;border: 1px solid #5684a3;line-height: 15px;margin-bottom: 10px">'+n.name+'</button>&nbsp;&nbsp;');
			namelist.push(n.name);
		}
	});
	$div.html(mlist);
}
//客户端采用家次详细信息
function loadAppAdoptDetailInfo(id){
	var data={};	 
	data["id"]=id;
	$('#appadopt_info_list').find("tbody").empty().html("<tr><td colspan='6'><div style='line-height:80px;'><span class='page_loading'></span>正在努力加载...</div></td></tr>");
	var t=$('#appadopt_info_list').DataTable({
		"language":{
			"url":"/js/plugins/dataTables/datatables_zh_CN.json"
		},
		"destroy":true ,
		"ajax": {
		        url: "/"+sysName_crossMedia+"/mod4/loadAdoptDetailInfo_app?type=2",
		        data: data 
		 },
		 //"deferRender": true,
		 columnDefs:[{
             orderable:false,//禁用排序
             targets:[0,0]   //指定的列
         }],
         "aaSorting": [[ 1, "desc" ]],
		 "columns" : [ 
                      {data:null},
		              { data : null,
						render: function(data, type, row) {
							return '<a href='+data.url+'  target=\'_blank\' class=\'title3\' title='+data.title+'>'+data.title+'</a>';
					     },
		              },
		              { "data" : "name"},
		              { "data" : "replycount"}, 
		              { "data" : "pubtime"}
				 ],
				 "fnDrawCallback" : function() {
					 $('.delApp').unbind("click").click(function () {
						   if(confirm("确定删除吗？")){
							   var id = $(this).data('aid');
								var caid =  $(this).data('caid');
								$.get("/"+sysName_crossMedia+"/mod4/cancelAppRelate",{artid:id,caid:caid},function(d){
									if(d=="ok"){  
										alert("删除成功");
										loadAppAdoptDetailInfo(id);
									}
								}); 
						   }
							
					});
					 //采用的app账号
					 loadAdoptMedia(data,$("#div_adopt_app"),"/"+sysName_crossMedia+"/mod4/loadAdoptDetailInfo_app?type=2");
				 }
	});
	t.on( 'order.dt search.dt', function () {
        t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        } );
    } )
    //.draw()
}