$.fn.fishBone = function(data) {
//  var colors = ['#F89782', '#1A84CE', '#F7A259', '#43A6DA', '#F9BF3B','#88C7CC','#EF6D5F','#60A96E','#F03852','#3A9284'];
    var colors = ['#1A84CE'];
    var colors = ['#17a293'];

    /**入口*/
    //1.创建dom
    $(this).children().remove();
    $(this).append(creataFishBone(data));
    //2.自适应
    var rowcount = fixWindow();
    //3.翻页滚动效果
    jQuery(".fishBone").slide({
        titCell: ".hd ul",
        mainCell: ".bd>ul",
        autoPage: true,
        effect: "left",
        autoPlay: false,
        scroll: rowcount,
        vis: rowcount
    });
    
    
    /**自适应 平均分布*/
    function fixWindow() {
        //item所占的宽度 = 自身宽度+marginleft
        var item = $(".fishBone .bd .item");
        var marginleft = parseInt(item.css('margin-left'))
        var item_w = item.width() + marginleft;

        //显示区域
        var bd_w = $(".fishBone .bd").width();
        //能显示的个数 取整
        var rowcount = parseInt(bd_w / item_w);
        if (rowcount > item.size()) {
            //rowcount = item.size();
            $(".fishBone .prev,.fishBone .next").hide()
        }
        //设置新的宽度使其平均分布
        var item_w_temp = bd_w / rowcount - marginleft;
        item.width(item_w_temp);
        return rowcount;
    };
    /**li左边框线颜色 border-left-color 动态获取*/
    function getColor(i) {
        var length = colors.length;
        var color = 'gray';
        if (i <= length - 1) {
            color = colors[i];
        } else {
            color = colors[i % length];
        }
        return color;
    };
    /**轴线上圆点位置纵坐标，见图片line-point.png*/
    function getLinePointY(i) {
        var length = colors.length;
        var y = 0;
        if (i <= length - 1) {
            y = -i * 20;
        } else {
            y = -(i % length) * 20;
        }
        return y + "px";
    };
    /**第一行日期圆点位置纵坐标，图片line-first.png*/
    function getLineFirstY(i) {
        var length = colors.length;
        var y = 0;
        if (i <= length - 1) {
            y = -i * 60;
        } else {
            y = -(i % length) * 60;
        }
        return y + "px";
    };
    /** .title-left背景纵坐标，0px开始，见图片title.png*/
    function getTitleLeftY(i) {
        var length = colors.length;
        var y = 0;//图片位置
        if (i <= length - 1) {
            y += -i * 60;
        } else {
            y += -(i % length) * 60;
        }
        return y + "px";
    };
    /** .title-center背景纵坐标，600px开始，见图片title.png*/
    function getTitleCenterY(i) {
        var length = colors.length;
        var y = -598;//图片位置
        if (i <= length - 1) {
            y += -i * 60;
        } else {
            y += -(i % length) * 60;
        }
        return y + "px";
    };
    /**.title-right背景纵坐标，1200px开始，见图片title.png*/
    function getTitleRightY(i) {
        var length = colors.length;
        var y = -1200;//图片位置
        if (i <= length - 1) {
            y += -i * 60;
        } else {
            y += -(i % length) * 60;
        }
        return y + "px";
    };
    /**创建dom结构*/
    function creataFishBone(data) {
        var fishBone = $("<div class='fishBone'/>");
        var wrapper = $("<div class='wrapper'></div>");
        var bd = $("<div class='bd'></div>");
        var ul_item = $("<ul/>");
//      debugger;
        //遍历数据
        $(data).each(function(index) {
            var itemclass=itemClass(index);//显示在轴上方或下方标识 top/bottom

            var color = getColor(index);
            var lineFirstY = getLineFirstY(index);
            
            var titleLeftY = getTitleLeftY(index);
            var titleCenterY = getTitleCenterY(index);
            var titleRightY = getTitleRightY(index);
            
            var ul = $("<ul></ul>");
            //遍历封装属性
            //封装审理时间和案号
            if(itemclass=='top' || itemclass=="bottom"){
                $.each(this, function(name, value) {
                	if (itemclass=="bottom") {
	                    if (name == 'date') {
	                        var li = $("<li class='line-li line-first_'>" + value + "</li>").css("border-left","1px solid "+color);//30是原计算结果的偏移量
	                        li.appendTo(ul);
	                        return;
	                    }
                	}else{
	                    if (name == 'date') {
	                        var li = $("<li class='line-first line-first1'>" + value + "</li>")
	                                    .css('background-position-y', -472+"px");//9是原计算结果的偏移量，显示位置正合适
	                        li.appendTo(ul);
	                        return;
	                    }
                	}
                });
                $.each(this, function(name, value) {
                    if (name == '案号') {
                        var li = $("<li class='title'></li>");
                        var titleLeft =  $("<span class='title-left'>&nbsp;</span>").css('background-position-y',titleLeftY);
                        var titleCenter =  $("<span class='title-center'>"+value+"</span>").css('background-position-y',titleCenterY);
                        var titleRight =  $("<span class='title-right'>&nbsp;</span>").css('background-position-y',titleRightY);
                        li.append(titleLeft).append(titleCenter).append(titleRight);
                        li.appendTo(ul);
                        return;
                    }
                });
            }
            //封装其他属性
            $.each(this, function(name, value) {
                if (name != '案号' && name != 'date' && name != 'more') {
                    var li ="";
                   /* if(!name.trim()){
                    	li =$("<li class='line-li' title='"+value+"'></li>").css({"border-left":"1px solid "+color,"height":"24px"});
                   	}else{
                   		li =$("<li class='line-li' title='"+value+"'>" + name + "：" + value + "</li>").css("border-left","1px solid "+color);
                   	}*/
                   	li =$("<li class='line-li line-lis'>" + value + "</li>").css("border-left","1px solid "+color);
                    li.appendTo(ul);
                }
                if (itemclass=="bottom") {
                	if (name == 'more') {
	                    var li = $("<li class='line-first line-more'>" + value + "</li>").css('background-position-y', (parseInt(lineFirstY)-92)+"px");
	                	li.appendTo(ul);
	                    return;
               		}
                }else{
                	if (name == 'more') {
                   		var li = $("<li class='line-more'>" + value + "</li>").css("border-left","1px solid "+color)
                		li.appendTo(ul);
                   		return;
              		}	
                }
                
            });
          //封装date和案号
//          if(itemclass=="bottom"){
//              $.each(this, function(name, value) {
//                  if (name == '案号') {
//                      var li = $("<li class='title'></li>");
//                      var titleLeft =  $("<span class='title-left'>&nbsp;</span>").css('background-position-y',titleLeftY);
//                      var titleCenter =  $("<span class='title-center'>"+value+"</span>").css('background-position-y',titleCenterY);
//                      var titleRight =  $("<span class='title-right'>&nbsp;</span>").css('background-position-y',titleRightY);
//                      li.append(titleLeft).append(titleCenter).append(titleRight);
//                      li.appendTo(ul);
//                      return;
//                  }
//              });
//              $.each(this, function(name, value) {
//                  if (name == 'date') {
//                      var li = $("<li class='line-first'>" + value + "</li>")
//                      .css('background-position-y', (parseInt(lineFirstY)-33)+"px");//30是原计算结果的偏移量
//                      li.appendTo(ul);
//                      return;
//                  }
//              });
//          }
            //封装轴线上的圆点
            var linePointY = getLinePointY(index);
            var point = $("<li class='line-last line-point'></li>").css('background-position-y', '-20px');
            point.appendTo(ul);
            
            //生成一个item（一个完整的案件）
            var li_item = $("<li class='item'></li>");
            var content = $("<div class='content'></div>");
            ul.appendTo(content);
            content.appendTo(li_item);
            li_item.addClass(itemClass(index)).appendTo(ul_item);
          	//填充没有的实体auther@lzk
          	/*if(itemclass="bottom"){
            	var i =ul.find("li").length;
            	for(var j=i;j<6;j++){
            		if(j==0){
            			ul.append("<li style='height:24px'></li>");
            		}
            		ul.find("li").first().after("<li class='line-li' style='height:24px;border-left:1px solid "+color+"'></li>");
            	}
            }else{
				var i =ul.find("li").length;
            	for(var j=i;j<6;j++){
            		ul.append("<li class='line-li' style='height:24px;border-left:1px solid "+color+"'></li>");
            	}            	
            }*/
          
        });
        ul_item.appendTo(bd);
        bd.appendTo(wrapper);

        var prev = $("<a class='prev'></a>");
        var next = $("<a class='next'></a>");
        var line = $("<div class='line'/>")

        fishBone.append(wrapper).append(prev).append(next).append(line);
        return fishBone;
    };
    /**item添加样式，显示在上方或下方*/
    function itemClass(index) {
        index += 1;
        if (index % 2 == 0) {
            //偶数显示到下方
            return "bottom";
        } else {
            //奇数显示到上方
            return "top";
        }
    }
}