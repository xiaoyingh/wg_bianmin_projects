
//经常提及
function often_mention_carrot_tree(rid,  time,type) {
	$("#netizens_list_action_clues").empty();
	$("#netizens_list_action_clues").addClass("changeImage");
	
    var param = {};
    param.rid = rid;
    param.time = time;
    param.type=type;
    $.getJSON("bloggerSecond/often_mention_per_org_loc", {
        rid:param.rid,
        time:param.time,
        type:param.type
    }, function(data) {
    	$("#netizens_list_action_clues").removeClass("changeImage");
        $("#netizens_list_action_clues").attr("style", "min-height: 300px;width:90%;float:left;");
        if (data && data != "[]" && data!="null") {
            var da = data;//JSON.parse(data);
            var fin = new Object();
            fin.groups = da;
            var foamtree, support;
            keywordTree("netizens_list_action_clues", foamtree, fin, rid, action_clues_click_search);
     
        } else {
        	$("#netizens_list_action_clues").removeClass("changeImage");
            $("#netizens_list_action_clues").html("<img style='display:block;margin:60px auto 50px auto;' src='img/my/bt-nodata-now"+photo+".png' />");
        }
   
    });
}
function action_clues_click_search(rid, keyword) {
    $("#netizens_list_action_info_title span i").text("");
    var time = $("#netizens_list_action_info_title a.click").data("time");
    var datas = {
        "rid": rid,
        "keyword": keyword,
        "time" : time
    };
    var option = new Object();
    option.isExport = false;
    option.param = {
        dynamicPath: "blogger__bloggerAnalysis__action_clues_info_list",
        data: JSON.stringify(datas)
    };
    option.callback = function() {
    	
//    	$("#netizens_list_action_info_content").load("../dynamic/blogger/bloggerAnalysis/action_clues_info_list.jsp");
        $("#netizens_list_action_info_title span i").text(keyword);
    };
    option.pageSize = 15;
    var obj = new iPage.ScrollLoadContainer("netizens_list_action_info_content", "/blogger/blogger_speechAnalysis_action_clues_info", option).init();
}

//萝卜树展示数据
function keywordTree(key_id, foamtree, data, eid, fun) {
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
             
                fun(eid, keyword);
            },
            //颜色定制
            groupColorDecorator: function(opts, params, vars) {
                // vars.groupColor.h = 200;// 260
                vars.groupColor.s = params.weightNormalized * 5000;
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
            backgroundColor: "#fff",
            borderWidth: 0.1,
            borderRadius: 0.35,
            groupBorderWidth: 1,
            groupBorderRadius: 1,
            groupFontFamily: "微软雅黑",
        });

        var keyword = data.groups[0].label;
        fun(eid, keyword);
    }
}