//获取参数
function get_article_param() {
	var eid = $(".leader_name_tags").find(".yy_sel").attr("eid") || $(".new_conf_tags").find(".yy_sel").attr("auto_id") || ""		//专题ID
	var cid = $(".leader_category_tags").find(".yy_sel").attr("cid") || "";
	searchtype = $("[name='sort_e'].active").val();   // 数据类型 0 全部 1 新闻 2 微信 
	site = $(".new_site").val();
	var time = $('.cDate').val().split(daterangepicker_separator);
	if (time[0]=='') {
		stime = '';
		etime = '';
	}else{
		stime = time[0];
		etime = time[1];
	}
	no_keywords = $("#no_keywords").val();
	keywords = $("#keywords").val();
	sort = $("[name='sort'].active").val();   //category_id
	supportLevel = $("[name='sort'].active").val();
	if (searchtype==4 || searchtype==0) {
		var dup = $("[name='dup'].active").val()
	}
	//var isDup=$(".new_paichong input[name='new_pai']:checked").attr("value");
	//var param = {"searchVo.eid":eid,"searchVo.type":searchtype,"searchVo.keywords":keywords,"searchVo.no_keywords":no_keywords,"searchVo.sort":sort,"searchVo.site":site,"searchVo.searchtype":searchtype,"searchVo.stime":stime,"searchVo.etime":etime,"searchVo.supportLevel":supportLevel,"searchVo.isDup":isDup,"path":"/page/business_al/dynamic/infoListBusinessAll.html"};
	var param = {"searchVo.isNotDup":dup,"searchVo.dataSourceType":searchtype,"searchVo.keywords":keywords,"searchVo.notKeywords":no_keywords,"searchVo.site":site,"searchVo.stime":stime,"searchVo.etime":etime,"searchVo.supportLevel":supportLevel,"path":"/dynamic/fullText_al/mod1/infoListBusinessAll.html"};
	return param;
}