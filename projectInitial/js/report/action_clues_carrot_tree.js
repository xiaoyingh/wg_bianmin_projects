
//话题与行动线索分析
function action_clues_carrot_tree(d,id,type) {
        var data = d;//.msg;
        $("#netizens_list_action_clues").attr("style", "min-height: 381px;");
        if (data &&data!=""&& data != "[]"&&data!="{}"&&data.length>0) {
            var da = data;//JSON.parse(data);
            var fin = new Object();
            fin.groups = da;
            var foamtree, support;
            			//		key_id,              foamtree, data, eid, fun
            keywordTree("netizens_list_action_clues", foamtree, fin, id, action_clues_click_search,type);
        } else {
            $("#netizens_list_action_clues").html("<img style='display:block;margin:60px auto 50px auto;' src='img/my/bt-nodata-now"+photo+".png' />");
            $("#netizens_list_action_info_content").html("<img style='display:block;margin:60px auto 50px auto;' src='img/my/bt-nodata-now"+photo+".png' />");
        }
}
function action_clues_click_search(rid, keyword,t) {
  $("#netizens_list_action_info_title span i").text("");
//var time = $("#netizens_list_action_info_title a.click").data("time");
  var datas = {
      "smSearchVo.uid": rid,
      "smSearchVo.keywords": keyword,
      "smSearchVo.sourceType" : t
  };
  var option = new Object();
  option.isExport = false;
  option.param = datas;
  option.callback = function() {    	
      $("#netizens_list_action_info_title span i").text(keyword);
      
      var uidUserName = $(".twitter-uid").attr("data-uid-username");
	  if(uidUserName){
		uidUserName = JSON.parse(uidUserName);
		$("strong.fullname.show-popup-with-id.twitter").each(function(){
			$(this).text(uidUserName[$(this).attr("data-uid")]);
		});
	  }
      
  };
  	option.pageSize = 15;
	option.isExport = false;
//	iPage.operBtnHtml="";
//  iPage.page_foot_html="";
//  option.container_foot_html ="";
//  option.page_foot_html="";
	var obj = new iPage.ScrollLoadContainer("netizens_list_action_info_content", "sm_al/mod2/getSpeechSummaryForTopoic", option).init();
}

//萝卜树展示数据
function keywordTree(key_id, foamtree, data, eid, fun,t) {
    supported = CarrotSearchFoamTree.supported;
    if (supported) {
       //console.log(data);
        var foamtree = new CarrotSearchFoamTree({
            id: key_id,
            dataObject: data
        });
        foamtree.set({
            onGroupSelectionChanged: function(info) {
                var keyword = info.selectedGroups[0].label;
             
                fun(eid, keyword,t);
            },
            //颜色定制
            groupColorDecorator: function(opts, params, vars) {
                // vars.groupColor.h = 200;// 260
//              vars.groupColor.s = params.weightNormalized * 5000;
            },
            groupLabelDecorator: function(opts, params, vars) {
                //vars.labelText += " (" +  params.group.weight + ")";
            },
            //titlebar 大小
            maxLabelSizeForTitleBar: 0,
            //相对大小变化步长
            aspectRatioImprovementSteps: 30,
            //权重拉伸---作用不大
            //groupWeightScaling:3,
            //背景颜色，宽度，弧度等全局定义
            backgroundColor: "rgba(0,0,0,0)",
//          borderWidth: 0.1,
//          borderRadius: 0.35,
//          groupBorderWidth: 1,
//          groupBorderRadius: 1,
            groupFontFamily: "Segoe UI",
        });

        var keyword = data.groups[0].label;
        fun(eid, keyword,t);
    }
}


