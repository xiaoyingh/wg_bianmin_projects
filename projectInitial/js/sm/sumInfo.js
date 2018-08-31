
var SumInfo={
		pageColumn:"600px",
	taskVo:function(){
		var vo=new Object();
		vo.condition= "";//检索条件“请输入关键词  或 @博主名称 或 s=站点名称”
		vo.startTime= "";//开始时间，格式：2015-01-01 00=00=00
		vo.endTime= "";//结束时间，格式：2015-01-01 00=00=00
		vo.blogType= "";//博文类型0原创1转发
		vo.emotiontend= "";//0全，1正，2负，3中立
		vo.rrtTag= "";//转发数大于
		vo.site= "";//站点名称 空格隔开
		vo.taskTheme= "";//业务主题（0中标1未中标）
		vo.blogScope= "";//博文范围，多个以空格分隔
		vo.funsUpLimit= "";//粉丝数上限
		vo.funsLowLimit= "";//粉丝数下限
		vo.blogerName= "";//博主名称
		vo.identyLev= "";//认证类型  0认证1未认证
		vo.datanum= "";//0-50,1-80,2-100
		vo.sort= "";
		vo.spam="";
		return vo;
	},
	getNowFormatDate:function() {
	    var date = new Date();
	    var seperator1 = "-";
	    var seperator2 = ":";
	    var month = date.getMonth() + 1;
	    var strDate = date.getDate();
	    if (month >= 1 && month <= 9) {
	        month = "0" + month;
	    }
	    if (strDate >= 0 && strDate <= 9) {
	        strDate = "0" + strDate;
	    }
	    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
	            + " " + date.getHours() + seperator2 + date.getMinutes()
	            + seperator2 + date.getSeconds();
	    return currentdate;
	},
		/*
		 * obj为获取data的容器
		 * class_为需要获取数据标签的标记类
		 * 当获取value标签类型为radio时候，为type="radio"组的共同父标签使用MYRADIO标签,并添加class_类
		 * 当需要获取选中input对应的text时，为input的标签添加tag属性用来标记input,为对应text的标签添加fortag="对应input的tag属性值"
		 * 当获取value标签类型为checkbox值时候，为type="checkbox"组的共同父标签使用MYCHECKBOX标签,并添加class_类
		 * 当需要获取选中input对应的text时，为input的标签添加tag属性用来标记input,为对应text的标签添加fortag="对应input的tag属性值"
		 * 返回对象的key为name属性值
		 */
	getFormData:function(obj,class_){
		     var paramObj = {};
		     var dataObjArr=$(obj).find("."+class_);//获取所有需要取值的标记类
		     $.each(dataObjArr,function(i,item){
		         var tagname=$(item)[0].tagName;
		         var name=$(item).attr("myname");
		         var val="";
		         var text="";
		         //获取select标签选中的value值和text
		         if(tagname=="INPUT"){
		            val=$(item).val();
		            text=$(item).html();
		         }else if(tagname=="SELECT"){
		           val=$(item).val();
		           text=$(item).find("option:selected").text();
		         }else if(tagname=="MYRADIO"){
		            val=$(item).find("input[type='radio']:checked").val();
		            var tag=$(item).find("input[type='radio']:checked").attr("tag");
		            text=$(item).find("[fortag='"+tag+"']").text()+" ";
		         }else if(tagname=="MYCHECKBOX"){
		             $.each($(item).find("input[type='checkbox']:checked"),function(i,citem){
		            	 if(null!=$(citem).val() && $(citem).val()!=""){
		            	 	if (i==0) {
		            	 		val+=$(citem).val();
		            	 	}else{
		            	 		val+=','+$(citem).val();
		            	 	}
		            		 
		            	 }
		                var tag=$(item).find("input[type='radio']:checked").attr("tag");
		                text+=$(item).find("[fortag='"+tag+"']").text()+" ";
		             });
		         }
		         if(name!= null && !$.isEmptyObject(name)){
					  	paramObj[name] = $.trim(val);
					  	paramObj[name+"txtval"]=$.trim(text);
				 }
		     });
		     
		     
		     return paramObj;
		},
		titleData:{task_term:"",task_name:"",category_id:"",category_name:""},
		//初始化基本模板title，返回模板加载的数据
		initBase_Title: function(obj,param,pub_level){
			
			param.type="task";
			//判断category_id是否为空，不为空则一定是根据站点类别进行查询
			if(!iFunc.isEmpty(param.site_id)){
				$(obj).find(".ibox-title >h5").html("").html(param.site_name);
				$(obj).find(".ibox-title .site_id").val(param.site_id);
				param.type="site";
			}else if(!iFunc.isEmpty(param.task_name)){//判断task_name是否为空，不为空则一定是根据常用任务进行查询
				$(obj).find(".ibox-title >h5").html("").html(param.task_name);
				$(obj).find(".ibox-title .task_name").val(param.task_name);
				$(obj).find(".ibox-title .task_id").val(param.task_id);
				$(obj).find(".ibox-title .pub_level").val(pub_level);
				param.type="task";
			}else if(!iFunc.isEmpty(param.title)){//如果自定义title，则title为自定义
				$(obj).find(".ibox-title >h5").html("").html(param.title);
			}
			if(!iFunc.isEmpty(param.task_term)){
				//最初的常用任务条件
				$(obj).find(".ibox-title .task_term").val(param.task_term);
				//用来更改的常用任务条件
				$(obj).find(".ibox-title .task_term_temp").val(param.task_term);
			}
			//初始化关闭按钮
			iScrollColumn.closeBtnInit($(obj).find(".ibox-title .close-link"),null,function(){
				var timer=$(obj).find(".timer").val();
            	if(!$.isEmptyObject(timer)){
            		clearInterval(timer);
            	}				
			});
			return param;
		},
		//初始化信息汇总页面模板title
	    initInfoStatic_Title: function(obj,param,type,pub_level){
	    
			var option=SumInfo.initBase_Title(obj,param,pub_level);//初始化基本title"page/mod1/mod/main.html"
			//为刷新图标添加点击事件
			$(obj).find(".ibox-title .refresh").unbind("click").click(function(){
				var fatherdiv=$(this).closest(".divColumn_box");
				$(fatherdiv).find(".ibox-title .locateparam").val("");
				//var category_id=$(fatherdiv).find(".ibox-title .category_id").val();
				var task_term=$(fatherdiv).find(".ibox-title .task_term").val();
				var containerId=$(fatherdiv).find(".feed-activity-list").attr("id");
				//$(obj).find(".feed-activity-list").attr("id","contentlist_search");
				$("#"+containerId).closest(".ibox-content").find(".newmes_warn").hide();
				if(!iFunc.isEmpty(task_term)){
					var taskterm=$.parseJSON(task_term);
					var showtype=$(fatherdiv).find(".ibox-title .showtype").val();
					SumInfo.initSearchList(containerId, "suminfo/inforSearch_get_media_infoList",{search_json:$.toJSON(taskterm)},showtype);
				}
			});
			//为提示应添加点击事件 
			$(obj).find(".ibox-title .sound").unbind("click").click(function(){
				var fatherdiv=$(this).closest(".ibox-tools");
				$(fatherdiv).find(".tipSoundId").val("false");//切换为静音
				$(fatherdiv).find(".display_sound").hide();
				$(fatherdiv).find(".display_mute").show();
			});
			$(obj).find(".ibox-title .mute").unbind("click").click(function(){
				var fatherdiv=$(this).closest(".ibox-tools");
				$(fatherdiv).find(".tipSoundId").val("true");//切换为有声音
				$(fatherdiv).find(".display_sound").show();
				$(fatherdiv).find(".display_mute").hide();
			});
			//为常用图标添加点击事件
			$(obj).find(".ibox-title .commontask").unbind("click").click(function(){
				var fatherdiv=$(this).closest(".divColumn_box");
				SumInfo.addOrUpdateCommonTask(fatherdiv);
			});
			//为筛选图标添加点击事件
			$(obj).find(".ibox-title .filter").unbind("click").click(function(){
				var fatherdiv=$(this).closest(".divColumn_box");
				var task_term=$(fatherdiv).find(".ibox-title .task_term").val();
				var pub_level=$(fatherdiv).find(".ibox-title .pub_level").val();
				if($(fatherdiv).find(".advanced_sea").is(":hidden")){
					SumInfo.initfilterPanleData($(fatherdiv).find(".advanced_sea"),task_term,pub_level);
					$(fatherdiv).find(".advanced_sea").css("display","block");
				}else{
					$(fatherdiv).find(".advanced_sea").hide();
				}
			});
			//为删除图标添加点击事件
			$(obj).find(".ibox-title .trash").unbind("click").click(function(){
				var fatherdiv=$(this).closest(".divColumn_box");
				var task_id=$(fatherdiv).find(".ibox-title .task_id").val();
				if(confirm("确定删除当前任务吗？")){
					SumInfo.commontaskOpr("delete",{autoId:task_id},function(){
						SumInfo.loadCommonTask();
						$(obj).find(".ibox-title .close-link").click();
			        });
				 }
			});
			//切换图标
			$(obj).find(".ibox-title .exchange").unbind("click").click(function(){
				var type=$(this).closest(".ibox-title").find(".showtype").val();
				if(type==='page'){
					$(this).closest(".ibox-title").find(".showtype").val("scroll");
					$(this).find("img").attr("src","img/icon/page_fanye.png");
				}else{
					$(this).find("img").attr("src","img/icon/page_gundong.png");
					$(this).closest(".ibox-title").find(".showtype").val("page");
				}
				$(this).closest(".ibox-title").find(".refresh").click();
			});
			if("myfocus"==type){
				var titlebtn=$(obj).find(".ibox-title .collapse-link");
				$(titlebtn).show();
				$(titlebtn).find(".sound").hide();
				$(titlebtn).find(".mute").hide();
				$(titlebtn).find(".exchange").hide();
				$(titlebtn).find(".refresh").hide();
				$(titlebtn).find(".static").hide();
				$(titlebtn).find(".trash").hide();
				$(titlebtn).find(".commontask").hide();
				//$(obj).find(".ibox-title .collapse-link").hide();//显示title上的点击图标
				$(obj).find(".ibox-title .filter").unbind("click").click(function(){
					var fatherdiv=$(this).closest(".divColumn_box");
					var task_term=$(fatherdiv).find(".ibox-title .task_term").val();
					if($(fatherdiv).find(".myconcern_condition_page").length==0){
						var filterCretia=$(fatherdiv).find(".ibox-content").find(".filterCretia");
						$(filterCretia).load("dynamic/infosum/searchcretia/filtermyfocus.html",function(){
							iFunc.checkbox_all_btn($(filterCretia), 'concern_type');
							$(filterCretia).find("input[name='concern_type']:eq(0)").click();
							$(filterCretia).find("#searchbtn").unbind("click").click(function(){
								var param = {};
								param.concern_status=$(filterCretia).find("input[name='concern_status']:checked").val();
								param.concern_type = new Array();
								$(filterCretia).find("input[name='concern_type']:checked").each(function(){
									if(null!=$(this).val() && $(this).val()!=""){
										param.concern_type.push($(this).val());
									}
								});
								param.concern_type = param.concern_type.join(",");
								url="suminfo/inforSearch_get_myAttention_infoList";
								id="contentlist_myfocus";
								param.callback=function(a,b){
									//博主名事件绑定
									$(a).find(".blogername").unbind("click").click(function(){
									   SumInfo.showBloggerDetail(this);
									});
									//关注结果列表事件绑定
									$(a).find(".showConcernResultlist").unbind("click").click(function(){
									  SumInfo.showConcernResultList(this);
									});
								}
								SumInfo.initSearchList(id,url,param,"scroll");
								$(fatherdiv).find(".advanced_sea").hide();
							});
						});
						$(fatherdiv).find(".myconcern_condition_page").find(".advanced_sea").css("display","block");
					}else{
						if($(fatherdiv).find(".advanced_sea").is(":hidden")){
							$(fatherdiv).find(".myconcern_condition_page").find(".advanced_sea").show();
						}else{
							$(fatherdiv).find(".advanced_sea").hide();
						}
					}
					
				});
			}else if("search"==type){
				var titlebtn=$(obj).find(".ibox-title .collapse-link");
				$(titlebtn).show();
				$(titlebtn).find(".trash").hide();
			}else{
				var titlebtn=$(obj).find(".ibox-title .collapse-link");
				$(titlebtn).show();
				$(titlebtn).find(".commontask").hide();
			}
			//为统计图标添加点击事件
			$(obj).find(".ibox-title .static").unbind("click").click(function(){
				var clickobj=$(this);
				var optionsParam={title:"",url:"page/mod2/mod3/main.html",success:function(obj){
					SumInfo.initBase_Title(obj,{});//初始化统计页面title
					//获取查询json串（常用任务）
					var task_term=$(clickobj).closest(".ibox-title").find(".task_term").val();
					//获取category_id
					option.task_term=task_term;
					SumInfo.initInfoStatic(obj,option);//初始化统计页面数据
				},width:SumInfo.pageColumn};
				iScrollColumn.extend($(clickobj),optionsParam,function(){});
			});
		},
		/**
		 * 保存或更新常用任务
		 * @param fatherdiv
		 */
		addOrUpdateCommonTask:function(fatherdiv,pub_level){
			var task_term=$(fatherdiv).find(".ibox-title .task_term").val();
			var task_name=$(fatherdiv).find(".ibox-title .task_name").val();
			//如果task_name为空，则说明该列的数据是由类别查询的,则为常用任务添加名称
			if($.isEmptyObject(task_name)){
				$("#addcommontaskModal").modal("show");
				$("#addcommontaskModal").find(".task_name").val("");
				$("#addcommontaskModal").find(".result").html("");
				$("#addcommontaskModal").find(".btn-primary").unbind("click").click(function(){
					task_name=$("#addcommontaskModal").find(".task_name").val();
					
					
					if(task_name==null || task_name==""){
				 		  $("#addcommontaskModal").find(".result").html("名称不能为空！").show();
				 		  return;
				 	   };
				 	   if(!check_special_characters(task_name)){
						   $("#addcommontaskModal").find(".result").html("任务名称应至少包含中文、英文、数字中的一种！").show();
						   return;
					   }
				 	   var re = /^[\u4E00-\u9FA5]{1,}[\u4E00-\u9FA5\x00-\xff.]{0,}$/;
					   if(re.test(task_name)){
					      if(task_name.length>20){
				 		   $("#addcommontaskModal").find(".result").html("任务名称只允许输入20个中文字符、40个英文字符").show();
				 		  return;
				 		  }
					   }else{
						  if(task_name.length>40){
				 			$("#addcommontaskModal").find(".result").html("任务名称只允许输入20个中文字符、40个英文字符").show();
				 			 return;
				 		  }
					   };
						
						
						function check_special_characters(task_name){
							//匹配数字，字母，汉字
							var pattern = new RegExp("[a-zA-Z0-9\u4e00-\u9fa5]");
							    
							if(pattern.test(task_name)){
							   return true;
							}
							   return false;
						}

						var param={taskName:task_name,taskTerm:task_term};
						SumInfo.commontaskOpr("save",param,function(){
							$("#addcommontaskModal").modal("hide");
							$("#addcommontaskModal").find(".result").hide();
							SumInfo.loadCommonTask();
						});
				});
			}else{
				 SumInfo.commontaskOpr("update",{taskName:task_name,taskTerm:task_term,pub_level:pub_level},function(){
					 confirm("已更新常用任务!");
				 });
			}
		},
		initSearchList:function(containerId,url,param,type){
			var pageSize=80;
			if(!$.isEmptyObject(param.search_json)){
				var term=$.parseJSON(param.search_json);
				if(!$.isEmptyObject(term.datanum)){
					pageSize=term.datanum;
				}
			}
			var callback=new function(){};
			if($.isFunction(param.callback)){
				callback=param.callback;
			}else{
				callback=function(a,b){
			          SumInfo.SearchBloggerArticalCallBack(containerId,a,b);
			    };
			}
//		     iPage.end_html= "<div class='page_end'>暂无更多数据</div>";
		     iPage.end_html='<div class="tracetotle " style="padding: 10px; border: 1px #ccc dashed; background-color: #f5f5f5; margin: auto; margin: 10px; margin-bottom: 30px; color: #1953a6; font-size: 14px; font-weight: bold; text-align: center;" _echarts_instance_="ec_1470050026642">暂无相关信息</div>'
		     var newparam=new Object();
		     newparam.pageSize=pageSize;
		     newparam.param=param;
		     newparam.callback=callback;
		     if(type=="page"){
		    	 iPage.page_foot_html = '<div class="page_info ipage-fenye"><div class="ipage-fenye-btn"><button class="startPage page_btn ipage-fenye-on">\u9996\u9875</button><button class="prePage page_btn ipage-fenye-on">\u4e0a\u9875</button><button class="nextPage page_btn ipage-fenye-on">\u4e0b\u9875</button><button class="endPage page_btn ipage-fenye-on" style="display:none;">\u5c3e\u9875</button>'+
		    	 '<input class="pageNo_input" type="text" value="1"/><button class="ipage-fenye-on go_btn">GO</button></div><div class="ipage-fenye-info">\u4fe1\u606f\u603b\u6570\uff1a<span class="ipage-number total"></span>&nbsp;&nbsp;\u603b\u9875\u6570\uff1a<span class="ipage-number totalPage"></span>&nbsp;&nbsp;\u5f53\u524d\u9875\uff1a<span class="ipage-number pageNo"></span></div></div>';
		    	 var obj = new iPage.PageLoad(containerId, url,newparam).init();
		     }else{
		    	 iPage.page_foot_html="";
				 iPage.container_foot_html="";
		    	 var obj = new iPage.ScrollLoadContainer(containerId, url,newparam).init();
		     }
		},
	    SearchBloggerArticalCallBack:function(containerId,cach_div,param){
                $(cach_div).find(".blogername").unbind("click").click(function(){
                   SumInfo.showBloggerDetail(this);
                });
                $(cach_div).find(".content").unbind("click").click(function(){
                	var obj=$(this).closest(".feed-element");
                	var data_table=$(obj).find(".data_table").html();
                	if(data_table=="googleplus_mbloginfo_ref" || data_table=="weibo" || data_table=="mblog_ref"){
                		if($(this).hasClass("mescon")){
                    		$(this).removeClass("mescon");
                    	}else{
                    		$(this).addClass("mescon");
                    	}
                	}
                	if(!$(obj).hasClass("alreadyread")){
                		SumInfo.isread(this);
                	}
                 });
                if(containerId=="contentlist_myfocus"){
                	return ;
                }
                //定时获取新博文
                var titleObj=$("#"+containerId).closest(".divColumn_box").find(".ibox-title");
                var locateparam=$(titleObj).find(".locateparam").val();
                var obj=JSON.parse(param.param.search_json);
                var today=SumInfo.getNowFormatDate();
                var end=obj.endTime;
                var data1=new Date(today);
                var data2=new Date(end);
                if(param.pageNo==1&&(iFunc.isEmpty(obj.endTime) ||data2.getTime() > data1.getTime()) ){
                	/*获取locateparam*/
                	var lp="";
                	//发布时间排序
                	if(obj.sort=="0"){
                		lp=$(cach_div).find(".pubtime").first().html();
                	}else if(obj.sort=="1"){//采集时间排序
                		lp=$(cach_div).find(".inserttime").first().html();
                	}else if(obj.sort=="2"){//转发数排序
                		lp=$(cach_div).find(".rtt_count").first().html();
                	}else if(obj.sort=="3"){//评论数排序
                		lp=$(cach_div).find(".cmt_count").first().html();
                	}else if(obj.sort=="4"){//博文字数排序
                		lp=$(cach_div).find(".word_num").first().html();
                	}
                	//obj.locateparam=lp;
                	obj.startTime=lp;
                	var newparam = {};
                	newparam.search_json = JSON.stringify(obj);
                	//param.param.search_json=JSON.stringify(obj);
                	$(titleObj).find(".locateparam").val(lp);
                	/*定时任务处理*/
                	var timer=$(titleObj).find(".timer").val();
                	if(!$.isEmptyObject(timer)){
                		clearInterval(timer);
                	}
                	
                	var IntervalUrl="suminfo/inforSearch_get_unread_infoNum";
                	var termobj=$.parseJSON(param.param.search_json);
                    IntervalUrl="suminfo/inforSearch_get_unread_infoNum";
                    var newtimer = setInterval(function(){SumInfo.Interval(containerId,newparam,IntervalUrl);},10000);
                    $(titleObj).find(".timer").val(newtimer);
                }
		},
		
		initfilterPanleData:function(filterobj,task_term,pub_level){
			
				   var jsonterm=$.parseJSON(task_term);
				   SumInfo.time_ridio(filterobj,"startTime","endTime");
				   //页面事件绑定
				   $(filterobj).find(".sort").find("label").unbind("click").click(function(){
				       $(this).find("input").prop("ckecked","checked");
				       $(this).siblings("label").find("input").prop("checked","");
				   });
				   $(filterobj).find(".spam").find("label").unbind("click").click(function(){
				       $(this).find("input").prop("ckecked","checked");
				       $(this).siblings("label").find("input").prop("checked","");
				   });
				   $(filterobj).find(".datanum").find("label").unbind("click").click(function(){
				       $(this).find("input").prop("ckecked","checked");
				       $(this).siblings("label").find("input").prop("checked","");
				   });
				   $(filterobj).find(".pub_level").find("label").unbind("click").click(function(){
				       $(this).find("input").prop("ckecked","checked");
				       $(this).siblings("label").find("input").prop("checked","");
				   });
				   //页面内容初始化
				   $(filterobj).find(".condition").val("");
				   if(!$.isEmptyObject(jsonterm.condition)){
					   $(filterobj).find(".condition").val(jsonterm.condition);
				   }
				   $(filterobj).find(".startTime").val("");
				   if(!$.isEmptyObject(jsonterm.startTime)){
					   $(filterobj).find(".startTime").val(jsonterm.startTime);
				   }
				   $(filterobj).find(".endTime").val("");
				   if(!$.isEmptyObject(jsonterm.endTime)){
					   $(filterobj).find(".endTime").val(jsonterm.endTime);
				   }
				   //博文类型
				   $.each($(filterobj).find(".blogType input"),function(i,item){
						   $(item).prop("checked",""); 
				   });
				   if(!$.isEmptyObject(jsonterm.blogType)){
					   var arr=jsonterm.blogType.split(" ");
					   $.each(arr,function(j,data){
						   $.each($(filterobj).find(".blogType input"),function(i,item){
							   if($(item).val()==data){
								   $(item).prop("checked","checked"); 
							   }
						   });
					   });
				   }
				   iFunc.checkbox_all_btn($(filterobj), "blogType", "myname");
				   
				   //业务主题（0中标1未中标）
				   $.each($(filterobj).find(".taskTheme input"),function(i,item){
						   $(item).prop("checked",""); 
				   });
				   if(!$.isEmptyObject(jsonterm.taskTheme)){
					   var arr=jsonterm.taskTheme.split(" ");
					   $.each(arr,function(j,data){
						   $.each($(filterobj).find(".taskTheme input"),function(i,item){
							   if($(item).val()==data){
								   $(item).prop("checked","checked"); 
							   }
						   });
					   });
				   }
				   iFunc.checkbox_all_btn($(filterobj), "taskTheme", "myname");
				   //博主范围
				   $.post("suminfo/find_userMblogCategory_by_depid",function(result){
					   $(filterobj).find(".blogScope").html("<label><input type='checkbox' myname='blogScope'  value='-1' checked='checked'>全部</label>");
					   if(!$.isEmptyObject(result.result)){
						   $.each(result.result,function(i,item){
							   $(filterobj).find(".blogScope").append("<label><input type='checkbox' myname='blogScope'  value='"+
									   item.auto_id+"'>"+item.category_name+"</label> ");
						   });
					   }
					   if(!$.isEmptyObject(jsonterm.blogScope)){
						   $(filterobj).find(".blogScope input").first().prop("checked",""); 
						   var arr=jsonterm.blogScope.split(" ");
						   $.each(arr,function(j,data){
							   $.each($(filterobj).find(".blogScope input"),function(i,item){
								   if($(item).val()==data){
									   $(item).prop("checked","checked"); 
								   }
							   });
						   });
					   }
					   iFunc.checkbox_all_btn($(filterobj), "blogScope", "myname");
//					   if($(filterobj).attr("id")=="senior_sea"){
//						   $(filterobj).find("input[myname='blogScope']").eq(0).click();
//					   }
				   });
				  //认证类型  0认证1未认证
				   $.each($(filterobj).find(".identyLev input"),function(i,item){
						   $(item).prop("checked",""); 
				   });
				   if(!$.isEmptyObject(jsonterm.identyLev)){
					   var arr=jsonterm.identyLev.split(" ");
					   $.each(arr,function(j,data){
						   $.each($(filterobj).find(".identyLev input"),function(i,item){
							   if($(item).val()==data){
								   $(item).prop("checked","checked"); 
							   }
						   });
					   });
				   }
				   iFunc.checkbox_all_btn($(filterobj), "identyLev", "myname");
				   //粉丝数上限
				   $(filterobj).find(".funsUpLimit").val("");
				   if(!$.isEmptyObject(jsonterm.funsUpLimit)){
					   $(filterobj).find(".funsUpLimit").val(jsonterm.funsUpLimit);
				   }
				   //粉丝数下限
				   $(filterobj).find(".funsLowLimit").val("");
				   if(!$.isEmptyObject(jsonterm.funsLowLimit)){
					   $(filterobj).find(".funsLowLimit").val(jsonterm.funsLowLimit);
				   }
				   $(filterobj).find(".rrtTag").val("");
				   if(!$.isEmptyObject(jsonterm.rrtTag)){
					   $(filterobj).find(".rrtTag").val(jsonterm.rrtTag);
				   }
				   //博主名称
				   $(filterobj).find(".blogerName").val("");
				   if(!$.isEmptyObject(jsonterm.blogerName)){
					   $(filterobj).find(".blogerName").val(jsonterm.blogerName);
				   }
				   //排序方式
				   $(filterobj).find("input[myname='sort']:checked").prop("checked","");
				   if(!$.isEmptyObject(jsonterm.sort)){
		        	   $.each($(filterobj).find("input[myname='sort']"),function(i,item){
						   if($(item).val()==jsonterm.sort){
							   $(item).prop("checked","checked");
						   }
					   });
		           }else{
		        	   $(filterobj).find("input[myname='sort']:eq(0)").prop("checked","checked");
		           }
				   $(filterobj).find("input[name='pub_level']:checked").prop("checked","");			 
				   if(!$.isEmptyObject(pub_level)){
		        	   $.each($(filterobj).find("input[myname='pub_level']"),function(i,item){
		        		
						   if($(item).val()==pub_level){
							   $(item).prop("checked","checked");
						   }
					   });
		           }else{
		        	   $(filterobj).find("input[myname='pub_level']:eq(0)").prop("checked","checked");
		           }
		           //排序方式
				   $(filterobj).find("input[myname='datanum']:checked").prop("checked","");
				   if(!$.isEmptyObject(jsonterm.datanum)){
		        	   $.each($(filterobj).find("input[myname='datanum']"),function(i,item){
						   if($(item).val()==jsonterm.datanum){
							   $(item).prop("checked","checked");
						   }
					   });
		           }else{
		        	   $(filterobj).find("input[myname='datanum']:eq(1)").prop("checked","checked");
		           }
				  
				   //垃圾过滤

				   $(filterobj).find("input[myname='spam']:checked").prop("checked","");
				   if(!$.isEmptyObject(jsonterm.spam)){
		        	   $.each($(filterobj).find("input[myname='spam']"),function(i,item){
						   if($(item).val()==jsonterm.spam){
							   $(item).prop("checked","checked");
						   }
					   });
		           }else{
		        	   $(filterobj).find("input[myname='spam']:eq(1)").prop("checked","checked");
		           }
				   //清空站点
				   $.each($(filterobj).find(".site input"),function(i,item){
						   $(item).prop("checked",""); 
				   });
				   $($(filterobj).find(".site").find("input")[0]).unbind("click").click(function(){
					   iFunc.clickall($(filterobj).find(".site"),this,"myname","site");
				   });
				   if(!$.isEmptyObject(jsonterm.site)){
					   var arr=jsonterm.site.split(" ");
					   $.each(arr,function(j,data){
						   $.each($(filterobj).find(".site input"),function(i,item){
							   if($(item).val()==data){
								   $(item).prop("checked","checked"); 
							   }
						   });
					   });
				   };
				   iFunc.checkbox_all_btn($(filterobj), "site", "myname");
				   
				   //清空情感倾向
				   $.each($(filterobj).find(".emotiontend input"),function(i,item){
						   $(item).prop("checked",""); 
				   });
				   $($(filterobj).find(".emotiontend").find("input")[0]).unbind("click").click(function(){
					   iFunc.clickall($(filterobj).find(".emotiontend"),this,"myname","emotiontend");
				   });
				   if(!$.isEmptyObject(jsonterm.emotiontend)){
					   var arr=jsonterm.emotiontend.split(" ");
					   $.each(arr,function(j,data){
						   $.each($(filterobj).find(".emotiontend input"),function(i,item){
							   if($(item).val()==data){
								   $(item).prop("checked","checked"); 
							   }
						   });
					   });
				   }
				   iFunc.checkbox_all_btn($(filterobj), "emotiontend", "myname");
				   //事件绑定
				   
			},
			gettaskParam: function(obj){
			    var searchVo=SumInfo.getFormData(obj,"mydata");
				var obj=SumInfo.taskVo();
			    obj.condition= searchVo.condition;//检索条件“请输入关键词  或 @博主名称 或 s:站点名称”
				obj.startTime= searchVo.startTime;//开始时间，格式：2015-01-01 00=00=00
				obj.endTime= searchVo.endTime;//结束时间，格式：2015-01-01 00=00=00
			    obj.blogType= searchVo.blogType;//博文类型0原创1转发
				obj.emotiontend= searchVo.emotiontend;//0全，1正，2负，3中立
				obj.rrtTag= searchVo.rrtTag;//转发数大于
				obj.site= searchVo.site;//站点名称 空格隔开
				obj.taskTheme= searchVo.taskTheme;//业务主题（0中标1未中标）
				obj.blogScope= searchVo.blogScope;//博文范围，多个以空格分隔
				obj.funsUpLimit= searchVo.funsUpLimit;//粉丝数上限
				obj.funsLowLimit= searchVo.funsLowLimit;//粉丝数下限
				obj.blogerName= searchVo.blogerName;//博主名称
				obj.identyLev= searchVo.identyLev;//认证类型  0认证1未认证
				obj.datanum= searchVo.datanum;//0-50,1-80,2-100
				obj.sort= searchVo.sort;
				obj.spam=searchVo.spam;
			    return obj;
			},	    
		    /*
	        * 溯源跳转事件
	        */
	       TraceSource:function(id,type){
	    	   $.post("infocollection/getKeywordsTraceSource",{id:id,type:type},function(data){
	    		   window.location.href=("?m1=5&m2=1&keywords="+data.keywords);
	    	   });
	       },
	       /**
	        * 通过id和type弹框展示新闻快照信息
	        */
	       showDetailByIdType:function(param){
	    	   $("#contentDetailModal").modal("toggle");
	           $.get("overview/get_content_detail_by_id",param,function(data){
	              $("#contentDetailModal").find(".modal-content").html(data);
	              $("#contentDetailModal").find(".ibox-title .close-link").unbind("click").click(function(){
	                 $("#contentDetailModal").modal("hide");
	              });
	           });
	       },
	       showBloggerDetail:function(obj){
	    	   var element=$(obj).closest(".feed-element");
	    	   var focusstatus=$(element).find(".focusstatus").html();
	    	   var datatable=$(element).find(".data_table").html();
	    	   var bloggerid=$(element).find(".blogger_id").html();
	    	   var siteid=$(element).find(".site_id").html();
	    	   var bloggername = $.trim($(obj).html());
	    	   var optionsParam={title:"",url:"page/mod2/mod4/main.html",success:function(obj){
	    		   $(obj).find(".bloggerDetail").html(iFunc.loading_html);
					SumInfo.initBase_Title(obj,{});//初始化统计页面title
					var param={bloggerid:bloggerid,datatable:datatable,siteid:siteid , bloggername:bloggername}
					//加载博客详细信息
					var $container = $(obj);//obj可能有重名，值被覆盖，所以换$container存储
					$.post("suminfo/get_blogger_basic_info",param,function(data){
						$container.find(".bloggerDetail").html(data);
						$container.find(".bloggerDetail").find(".to_concern_blogger").unbind("click").click(function(){
							var userid = $(this).attr("userid");
							var sid = $(this).attr("sid");
							var $obj = $(this);
							add_real_account_modal(userid,sid,function(){
								$obj.parent().html("已关注");
							});
						});	
					})
					var sumobj=$(".bloggerLatestArtical");
					var bloggerLatestArticalid="bloggerLatestArtical"+new Date().getTime();
					$(obj).find(".bloggerLatestArtical").attr("id",bloggerLatestArticalid);
				    var url="suminfo/inforSearch_get_latest_bloggerArticle";
					//加载博客近期博文
				    iPage.page_foot_html="";
					iPage.container_foot_html="";
//					iPage.end_html= "<div class='page_end'>暂无更多数据</div>";
				    iPage.end_html='<div class="tracetotle " style="padding: 10px; border: 1px #ccc dashed; background-color: #f5f5f5; margin: auto; margin: 10px; margin-bottom: 30px; color: #1953a6; font-size: 14px; font-weight: bold; text-align: center;" _echarts_instance_="ec_1470050026642">暂无相关信息</div>'
			    	var obj = new iPage.ScrollLoadContainer(bloggerLatestArticalid, url,{param:param}).init();
				},width:SumInfo.pageColumn};
				iScrollColumn.extend($(obj),optionsParam,function(){});
	       },
	       showConcernResultList:function(obj){
	    	   var element=$(obj).closest(".feed-element");
	    	   var focus_id=$(element).find(".focus_id").html();
	    	   var data_table=$(element).find(".data_table").html();
	    	   var data_id=$(element).find(".data_id").html();
	    	   var concern_type=$(element).find(".concern_type").html();
	    	   var optionsParam={title:"",url:"page/mod2/mod2/main.html",success:function(obj){
					SumInfo.initBase_Title(obj,{});//初始化页面title
					var param={concern_type:concern_type,data_id:data_id};
					var concernResultid="concernResult"+param.data_id;
					$(obj).find(".concernResult").attr("id",concernResultid);
				    var url="suminfo/concernResultList";
					//加载博客近期博文
				    iPage.page_foot_html="";
					iPage.container_foot_html="";
//					iPage.end_html= "<div class='page_end'>暂无更多数据</div>";
				    iPage.end_html='<div class="tracetotle " style="padding: 10px; border: 1px #ccc dashed; background-color: #f5f5f5; margin: auto; margin: 10px; margin-bottom: 30px; color: #1953a6; font-size: 14px; font-weight: bold; text-align: center;" _echarts_instance_="ec_1470050026642">暂无相关信息</div>'
			    	var obj = new iPage.ScrollLoadContainer(concernResultid, url,{param:param}).init();
				},width:SumInfo.pageColumn};
				iScrollColumn.extend($(obj),optionsParam,function(){});
	       },
	       /*
			 * 常用任务操作
			 */
		   commontaskOpr:function(type,param,success,error){
			    var ajaxurl="";
				if(type=="update"){
					 ajaxurl="suminfo/inforSearch_update_searchTask";
				}else if(type=="save"){
					 ajaxurl="suminfo/inforSearch_add_searchTask";
				}else if(type=="delete"){
					 ajaxurl="suminfo/inforSearch_delete_searchTask";
				}
				$.post(ajaxurl,param,
			               function(data){
			                    if(data=="success"||data=="true"){
			                       success();
			                       //alert("操作成功！");
			                    }else if((data=="nolevel")&&(type=="update")){
				                      alert("您没有权限编辑该任务！");
				                       //alert("该类别名称已存在！"); 
				                }else if((data=="nolevel")&&(type=="delete")){
				                      alert("您没有权限删除该任务！");
				                       //alert("该类别名称已存在！"); 
				                }else if(data=="fail"){
			                       error();
			                       //alert("该类别名称已存在！"); 
			                    }else if(data=="error"){
			                       alert("操作失败！");
			                    }
			                });
			},
		   Interval:function(containerId,param,ajaxurl){
			//var ajaxurl="suminfo/inforSearch_get_unread_infoNum";
			   $("#"+containerId).closest(".ibox-content").find(".newmes_warn").unbind("click").click(function(){
				   $("#"+containerId).closest(".divColumn_box").find(".ibox-title .refresh").click();
			   });
				$.post(ajaxurl,param,
			        function(data){
					var titleObj=$("#"+containerId).closest(".divColumn_box").find(".ibox-title").find(".tipSoundId").val();
					if(data>0){
						
						if(titleObj=="true"){
							$('#chatAudio')[0].play();
						}else{
							
						}
					    	$("#"+containerId).closest(".ibox-content").find(".new_infonum").html(data);
					        $("#"+containerId).closest(".ibox-content").find(".newmes_warn").show();
					    }
			         });
			},
			footClick:function(obj,type){
				var element=$(obj).closest(".feed-element");
				var focus_id=$(element).find(".focus_id").html();
				var data_id=$(element).find(".data_id").html();
				var blogger_id=$(element).find(".blogger_id").html();
				var blogger_name=$(element).find(".blogername").html();
				var data_table=$(element).find(".data_table").html();
				var site_name=$(element).find(".site_name").html();
				var site_id=$(element).find(".site_id").html();
				var infotype=$(element).find(".info_type").html();
				var title=$(element).find(".title").text();
				var content=$.trim($(element).find(".content").text());
				var source_url=$(element).find(".source_url").attr("href");
				var rtt_count=$(element).find(".rtt_count").html();
				var cmt_count=$(element).find(".comment").html();
				var pubtime=$(element).find(".pubtime").html();
				var showbox=$(element).find(".showbox");
				
				var blogger_headimg = $.trim($(element).find(".blogger_headimg").html());
				var blogger_fanscount = $.trim($(element).find(".blogger_fanscount").html());
				//关注微博
				if(type=="focus"){
					$.get("dynamic/infosum/window/focus.html",function(result){
						$(showbox).html("");
						$(showbox).append(result);
						$(showbox).find(".focScope").unbind("click").click(function(){
							$(showbox).find(".focScope").prop("checked","");
							$(this).prop("checked","checked");
						});
                        $(showbox).find(".tScope").unbind("click").click(function(){
                        	$(showbox).find(".tScope").prop("checked","");
                        	$(this).prop("checked","checked");
						});
						$(showbox).find(".removebtn").unbind("click").click(function(){
							$(showbox).html("");
						});
						$(showbox).find(".focusbtn").unbind("click").click(function(){
							var param=SumInfo.getFormData(showbox,"mydata");
							$.post("suminfo/blogManage_follow_blogger",{data_id:data_id,
								data_table:data_table,
								concern_type:param.focusScope,
								time_type:param.timeScope,
								pubtime:pubtime,
								site_id:site_id,
								infotype:infotype,
								url:source_url
								,blogger:blogger_name
								,blogger_headimg:blogger_headimg
								,blogger_fanscount:blogger_fanscount
								,blogger_id:blogger_id
								,content:content},
								function(data1){
									if(data1=="success"){
								    	   $(obj).css("display","none");
								    	   $(obj).removeAttr("onclick");
								    	   $(obj).parent().html("已关注").fadeIn(1000);
								       }else{
								    	   $(obj).css("display","none");
								    	   $(obj).html("关注失败").fadeIn(1000,function(){
								    		   $(obj).css("display","none");
									    	   $(obj).html("关注").fadeIn(1000);// 这个是渐渐消失
								    	   });
								       }
							});
							$(showbox).html("");
						});
					});
					
				}else if(type=="generate"){//生成材料
					$.get("dynamic/infosum/window/generateData.html",function(result){
						$(showbox).html("");
						$(showbox).append(result);
						$(showbox).find(".removebtn").unbind("click").click(function(){
							$(showbox).html("");
						});
						$(showbox).find(".gegerateData").html("loading......");
						var generatedata=$(element).find(".generatedata").html();
						if("1"==site_id){
							$.post("search/generate_material_get_crawlerflag",{bloggerid:blogger_id,bloggername:blogger_name},function(data){
								$(showbox).find(".gegerateData").html(generatedata);
								if(null!=data && data!=""){
									$(showbox).find(".gegerateData").find(".validateInfo").after("，认证信息："+data);
								}
								var obj=$(".gegerateData");
								var id=obj.length;
								$(showbox).find(".gegerateData").prop("id","gegerateDataid"+id);
								$(showbox).find(".copybtn").attr("data-clipboard-target","#gegerateDataid"+id);
								var clipboard = new Clipboard($(showbox).find(".copybtn").get(0));
								    clipboard.on('success', function(e) {
								        console.log(e);
								    });
								    clipboard.on('error', function(e) {
								        console.log(e);
								    });							
							})
						}else{
							$(showbox).find(".gegerateData").html(generatedata);
							var obj=$(".gegerateData");
							var id=obj.length;
							$(showbox).find(".gegerateData").prop("id","gegerateDataid"+id);
							$(showbox).find(".copybtn").attr("data-clipboard-target","#gegerateDataid"+id);
							var clipboard = new Clipboard($(showbox).find(".copybtn").get(0));
							    clipboard.on('success', function(e) {
							        console.log(e);
							    });
							    clipboard.on('error', function(e) {
							        console.log(e);
							    });	
						}
					});
				}else if(type=="deletefocus"){
					if(!confirm("确定要取消关注该信息吗！")){
						return;
					}
					$.post("suminfo/blogManage_delete_follow_blogger",{auto_id:focus_id},
						function(data2){
						   if(data2=="success"){
					    	   $(obj).css("display","none");
					    	   $(obj).attr("onclick","SumInfo.footClick(this,'focus')");
					    	   $(obj).closest(".feed-element").remove();
//					    	   $(obj).html("删除成功").fadeIn(1000,function(){
//					    		   $(obj).css("display","none");
//						    	   $(obj).html("关注").fadeIn(1000);// 这个是渐渐消失  
//					    	   });// 这个是渐渐消失
					       }else{
					    	   $(obj).css("display","none");
					    	   $(obj).html("取消失败").fadeIn(1000,function(){
					    		   $(obj).css("display","none");
						    	   $(obj).html("取消关注").fadeIn(1000);// 这个是渐渐消失
					    	   });// 这个是渐渐消失
					       }
					});
				}else if(type=="refocus"){
					var date = iFunc.curDateTime();
					var $container = $(obj).closest(".concern_single_info");
					$.post("suminfo/blogManage_refollow_blogger",{auto_id:focus_id,date:date},
							function(data3){
						var test ='${concern_time}';
						      if(data3=="success"){
					    	     $(obj).css("display","none");
					    	     $(obj).parent().html("重新关注成功").fadeIn(1000,function(){
//					    		   $(obj).css("display","none");
//						    	   $(obj).html("关注").fadeIn(2000);// 这个是渐渐消失  
					    	     });// 这个是渐渐消失
					    	     $container.find(".advanced_sea_infonum").find(".concern_time").html(date);
					    	     $container.find(".advanced_sea_infonum").find(".concern_status").html("关注中");
					           }else{
					    	     $(obj).css("display","none");
					    	     $(obj).html("重新关注失败").fadeIn(1000,function(){
					    		   $(obj).css("display","none");
						    	   $(obj).html("重新关注").fadeIn(1000);// 这个是渐渐消失
					    	     });// 这个是渐渐消失
					           }
						});
				}else if(type=="favorite"){
					var param=new Object();
					param.data_id=data_id;
				    param.blogger_id=blogger_id;
				    param.blogger_name=blogger_name;
				    param.site_name=site_name;
				    param.title=title;
				    param.content=content; 
				    param.source_url=source_url;
				    param.rtt_count=rtt_count;
				    param.cmt_count=cmt_count;
				    param.pubtime=pubtime;
					$.post("suminfo/blogManage_collect_blog",{param:$.toJSON(param)},
							function(data){
						       if(data=="success"){
						    	   $(obj).css("display","none");
						    	   $(obj).attr("onclick","");
						    	   $(obj).html("已收藏").fadeIn(1000);// 这个是渐渐消失
						       }else{
						    	   $(obj).css("display","none");
						    	   $(obj).html("收藏失败").fadeIn(1000,function(){
						    		   $(obj).css("display","none");
							    	   $(obj).html("收藏").fadeIn(1000);// 这个是渐渐消失
						    	     });// 这个是渐渐消失
						       }
						});
				}else if(type=="bloggeranlasys"){
					$.post("suminfo/blogManage_collect_blog",{data_id:data_id,data_table:data_table},
							function(data){
						});
				}
				
			},
			//为统计页面添加数据
			initInfoStatic:function(obj,option){
				//初始化趋势统计
				SumInfo.initTrancetotleChart(obj,option);
				//初始化数据量统计
				SumInfo.initKeywordLableChart(obj,option);
				//初始化网名排名
				SumInfo.initNetizonrange(obj,option);
			},
			//根据常用任务或者网站类别查询统计趋势排行数据
			initTrancetotleChart:function(obj,option){
				var url="";
				var param={};
				url="suminfo/inforSearch_post_trend";
				param={search_json:option.task_term};
			   var myChart = echarts.init($(obj).find(".tracetotle").get(0),"macarons");
			   myChart.showLoading();
			   $.post(url,param,function(result){
				   var xdata=new Array();
				   var ydata=new Array();
				   if(!$.isEmptyObject(result.list)){
					   var data=result.list;
					   for(var i=data.length-1;i>-1;i--){
					        xdata.push(data[i][0]);
					        ydata.push(data[i][1]);
					    }
				   }
				    myChart.hideLoading();
				    if(xdata && xdata.length>0&&ydata && ydata.length>0){
				    	SumInfo.drawTraceTotleChart(xdata,ydata,myChart);
					}else{
						$(obj).find(".tracetotle").html("暂无相关信息");
						$(obj).find(".tracetotle").attr("style","padding: 10px; border: 1px #ccc dashed; background-color: #f5f5f5; margin: auto; margin: 10px; margin-bottom: 30px; color: #1953a6; font-size: 14px; font-weight: bold; text-align: center;");
				     }
				});
			},
			drawTraceTotleChart:function(xdata,ydata,myChart){
				var option = {
						grid: {
					        x: '80'
					    },
					    tooltip : {
					        trigger: 'axis'
					    },
					    legend: {
					        data:[]
					    },
					    toolbox: {
					        show : true,
					        feature : {
					            mark : {show: true},
					            dataView : {show: true, readOnly: false},
					            magicType : {show: true, type: ['line', 'bar']},
					            restore : {show: true},
					            saveAsImage : {show: true}
					        },
					        right:60
					    },
					    calculable : true,
					    xAxis : [
					        {
					            type : 'category',
					            boundaryGap : false,
					            data : xdata
					        }
					    ],
					    yAxis : [
					        {
					            type : 'value'
					        }
					    ],
					    series : [
					        {
					            name:'数据量',
					            type:'line',
					            stack: '',
					            data:ydata
					        }
					    ]
					};
				myChart.setOption(option);
				window.onresize = function () {
					myChart.resize(); // 图表自适应
				}

			},
			//初始化信息汇总站点统计echcar
			drawKeywordLableChart:function(newdata,myChart){
//				newdata.name=nameArr;
//				newdata.chartsdata=dataArr;
//				newdata.sumtotal=data.total;
//				newdata.rttcount=data.rttcount;
//				newdata.commentcount=data.commentcount;
			     var options = {
			    		    tooltip : {
			    		        trigger: 'item',
			    		        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    		    },
			    		    legend: {
			    		        orient : 'vertical',
			    		        x : 'left',
			    		        data:newdata.name
			    		    },
			    		    toolbox: {
			    		        show : true,
			    		        feature : {
			    		            mark : {show: true},
			    		            dataView : {show: true, readOnly: false},
			    		            magicType : {
			    		                show: true, 
			    		                type: ['pie', 'funnel'],
			    		                option: {
			    		                    funnel: {
			    		                        x: '25%',
			    		                        width: '50%',
			    		                        funnelAlign: 'center',
			    		                        max: 1548
			    		                    }
			    		                }
			    		            },
			    		            restore : {show: true},
			    		            saveAsImage : {show: true}
			    		        },
			    		        right:60
			    		    },
			    		    calculable : true,
			    		    series : [
			    		        {
			    		            name:'',
			    		            type:'pie',
			    		            radius : ['50%', '70%'],
			    		            itemStyle : {
			    		                normal : {
			    		                    label : {
			    		                        show : false
			    		                    },
			    		                    labelLine : {
			    		                        show : false
			    		                    }
			    		                },
			    		                emphasis : {
			    		                    label : {
			    		                        show : true,
			    		                        position : 'center',
			    		                        textStyle : {
			    		                            fontSize : '30',
			    		                            fontWeight : 'bold'
			    		                        }
			    		                    }
			    		                }
			    		            },
			    		            data:newdata.chartsdata
			    		        }
			    		    ]
			    		};
				 myChart.setOption(options);
			     window.onresize = function () {
			    	 myChart.resize(); // 图表自适应
				}
			},
			//网民排名
			initNetizonrange:function(obj,option){
				$(obj).find(".netizonrange").html("<tr><td colspan='5'>"+iFunc.loading_html+"</td></tr>");
				var url="";
				var param={};
				url="suminfo/inforSearch_ranking_netizen";
				param={search_json:option.task_term};
			   //iFunc.showLoading($(obj).find(".netizonrange"));
			   $.post(url,param,function(result){
				   var data=result.list;
				   var html="";
				   //iFunc.hideLoading($(obj).find(".netizonrange"));
				   if($.isEmptyObject(data)){
					   $(obj).find(".netizonrange").closest("div").append("<div class='nodata'>暂无相关信息</div>");
					   $(obj).find(".netizonrange").closest("div").find(".nodata").attr("style","padding: 10px; border: 1px #ccc dashed; background-color: #f5f5f5; margin: auto; margin: 10px; margin-bottom: 30px; color: #1953a6; font-size: 14px; font-weight: bold; text-align: center;");
				   }else{
					   $.each(data,function(i,item){
					    	var da=item;
					    	var sitename_sid = "--";
					    	if(null!=item.sid && item.sid!=""){
					    		sitename_sid = "新浪微博";
					    		if("1"==item.sid){
					    			sitename_sid = "新浪微博";
					    		}else if("2"==item.sid){
					    			sitename_sid = "腾讯微博";
					    		}else if("3"==item.sid){
					    			sitename_sid = "人民微博";
					    		}
					    	}
					    	var userName=item.userName==null?item.id:item.userName;
					    	var siteName=item.siteName==null?sitename_sid:item.siteName;
					    	var focushtml="--";
					    	if(!$.isEmptyObject(item.focus)){
					    		focushtml="已关注";
					    	}else if(!$.isEmptyObject(item.sid)&&!$.isEmptyObject(item.id)&&item.siteName!="GoolePlus"){
					    		focushtml="<a>关注</a>";
					    	}
					    	html+="<tr>" +
					    	        "<input type='hidden' class='userid' value='"+item.id+"'>"+
					    	        "<input type='hidden' class='sid' value='"+item.sid+"'>"+
					    	        "<td class='text-center'>"+(i+1)+"</td>"+
					    	        "<td class='text-center'>"+userName+"</td>"+
									"<td class='text-center small'>"+item.infoCounts+"</td>"+
									"<td class='text-center'>"+siteName+"</td>";
							if(!$.isEmptyObject(item.focus)){
								html+="<td class='text-center'>"+focushtml+"</td>"+"</tr>";
							}else{
								html+="<td class='text-center focus'>"+focushtml+"</td>"+"</tr>";
							}
					    });
					   $(obj).find(".netizonrange").html(html);
					   $(obj).find(".netizonrange").find(".focus a").unbind("click").click(function(){
						   var tr=$(this).closest("tr");
						   var userid=$(tr).find(".userid").val();
						   var sid=$(tr).find(".sid").val();
						   add_real_account_modal(userid,sid,function(){
							   $(this).closest("td").html("已关注");
						   });
					   });
				   }
				});
			},
			//统计页面：根据常用任务或者网站类别查询站点排行数据
			initKeywordLableChart:function(obj,option){
				var url="";
				var param={};
				url="suminfo/inforSearch_person_behavior_num";
				param={search_json:option.task_term};
			   var myChart = echarts.init($(obj).find(".datanumcount").get(0),"macarons");
			   myChart.showLoading();
			   $.post(url,param,function(result){
				    var newdata=new Object();
				    var nameArr=new Array();
				    var dataArr=new Array();
					var dataArr=new Array();
					if(!$.isEmptyObject(result)){
						if(!$.isEmptyObject(result.result)){
							var data=result.result;
							nameArr.push("原创");
						    nameArr.push("转发");
							dataArr.push({name:"原创",value:data.original});
							dataArr.push({name:"转发",value:data.retransmission});
							newdata.name=nameArr;
							newdata.chartsdata=dataArr;
							newdata.sumtotal=result.total;
							$(obj).find(".totalcount").html(newdata.sumtotal);
							newdata.rttcount=data.rttcount;
							$(obj).find(".rttcount").html(newdata.rttcount);
							newdata.commentcount=data.commentcount;
							$(obj).find(".commentcount").html(newdata.commentcount);
						}
					}
				    myChart.hideLoading();
				    if(!$.isEmptyObject(newdata)){
				    	SumInfo.drawKeywordLableChart(newdata,myChart);
					}else{
						$($(obj).find(".numcountandtotal").get(0)).html("暂无相关信息");
						$($(obj).find(".numcountandtotal").get(0)).attr("style","padding: 10px; border: 1px #ccc dashed; background-color: #f5f5f5; margin: auto; margin: 10px; margin-bottom: 30px; color: #1953a6; font-size: 14px; font-weight: bold; text-align: center;");
				     }
				});
			},
			nofindPhotowx:function(obj){
				var element=$(obj).closest(".feed-element");
				var cach_div=$(element).find(".cach_div");
				var sitename=$(cach_div).find(".site_name").html();
				if(sitename==undefined){//活跃博主排行榜
					sitename = $(obj).attr("data-siteName");
				}
				var img="images/headimg.jpg";
				if(!$.isEmptyObject(sitename)){
					if(sitename=="Twitter" || sitename=="1"){
						img="images/twitter.jpg";
					}else if(sitename=="人民微博" || sitename=="7"){
						img="images/t_renmin.jpg";
					}else if(sitename=="腾讯微博" || sitename=="3"){
						img="images/t_qq.jpg";
					}else if(sitename=="Twitter" || sitename=="5"){
						img="images/t_twitter.jpg";
					}else if(sitename=="Google+" || sitename=="8"){
						img="images/t_google_plus.png";
					}
				}
				var ele=event.srcElement;
				ele.src=img;
				ele.onerror=null; //控制不要一直跳动
				//$(obj).attr("src",img);
			},
			setfavo:function(obj,options){
				   $.ajax({
						url: "suminfo/blogManage_collect_blog",
						type: "POST",
						async:true,
						data:options,
						success: function(data){
							$(obj).closest(".media-body-foot").find(".statustag").html("").show();
							if(data=="false"){
								$(obj).closest(".media-body-foot").find(".statustag").html("已收藏！").fadeIn("slow").fadeOut(2000);// 这个是渐渐消失 
								//alert("已收藏！");
							}else if(data=="error"){
								$(obj).closest(".media-body-foot").find(".statustag").html("标记收藏失败！").fadeIn("slow").fadeOut(2000);// 这个是渐渐消失 
								//consle("标记收藏失败！");
							}else if(data=="success"){
								$(obj).closest(".media-body-foot").find(".statustag").html("收藏成功！").fadeIn("slow").fadeOut(2000);// 这个是渐渐消失 
//								$(obj).next().html("收藏成功！").hide(3000);// 这个是渐渐消失 
							}
//							$(obj).closest(".media-body-foot").find(".statustag").html("");
						}
						});
	    },
		loadCommonTask:function (name){
			$(".common_tasks_container").find(".common_tasks").html(iFunc.loading_html);
		     $.post("suminfo/inforSearch_get_searchTask",{name : name},function(data){
		    	 	var $container = $(".common_tasks_container").find(".common_tasks");
		            var html="";
			        $.each(data,function(i,item){
		            html+="<span style='padding:0 10px;' class='task_item tishi menu'>"+
		                  "<a href='#' ><span class='taskname' >"+item.task_name+"</span></a>"+
		                   "<span class='taskid' style='display:none;'>"+item.auto_id+"</span>"+
		                   "<span class='task_term' style='display:none;'>"+item.task_term+"</span>"+
		                  "</span>";
		              });
		            if(data.length<1){
		            	$container.html("<lable style='font-size:1.5em;'>暂无相关任务！</lable>");
		            }else{
		            	$container.html(html);
		            }
		            //初始化
//		            iFunc.initCommenttaskNavBtn($("#common_tasks"));
		            //初始化我的常用任务的任务点击事件
		            $container.find(".taskname").unbind("click").click(function(){
		               var task_term=$(this).closest(".task_item").find(".task_term").html();
		               var task_name=$(this).closest(".task_item").find(".taskname").html();
		               var task_id=$(this).closest(".task_item").find(".taskid").html();
		               var pub_level=$(this).closest(".task_item").find(".pub_level").html();
		               SumInfo.search({task_term:task_term,task_name:task_name,auto_id:task_id,pub_level:pub_level}); 
		            });
		    		//判断是否为博主分析页跳转，从而加载相应内容
//		    		loadBloggerContent(); 
		            
			});
		},
		/**
		 * 点击查询方法 data:查询条件；type:查询类型（adsearch:高级检索；myfocus:我的关注）
		 * @param data
		 * @param type
		 */
		search:function (data,type,showtype,pub_level){
			var inforArray=new Array();
			var task_term=data.task_term;
			if($.isEmptyObject(data.task_name)){
			      data.task_name="";
			}
			if(judgeisExist(data.task_name)){
			   return;
			}
			if($.isEmptyObject(data.category_id)){
			      data.category_id="";
			}
			if($.isEmptyObject(data.category_name)){
			      data.category_name="";
			}
			var titledata={task_id:data.auto_id,task_term:task_term,task_name:data.task_name,category_id:data.category_id,category_name:data.category_name};
			var url="suminfo/inforSearch_get_media_infoList";
			var param={};
			var id="";
			if("myfocus"==type){
			      titledata.title="我的关注";
			      url="suminfo/inforSearch_get_myAttention_infoList";
			      id="contentlist_myfocus";
			      param.callback=function(a,b){
			    	  //博主名事件绑定
			    	  $(a).find(".blogername").unbind("click").click(function(){
		                   SumInfo.showBloggerDetail(this);
		              });
			    	  //关注结果列表事件绑定
			    	  $(a).find(".showConcernResultlist").unbind("click").click(function(){
			    		  SumInfo.showConcernResultList(this);
			    	  });
			      }
			}else if("search"==type){
			      param={search_json:titledata.task_term , search_log:true};
			      id="contentlist_search"; 
			}else{
			    param={search_json:titledata.task_term};
			    id="contentlist_"+titledata.task_id;
			}
			var paramOption = {url:"page/mod2/mod/main.html",width:SumInfo.pageColumn,success:function(obj){
		     	//初始化title
		     	SumInfo.initInfoStatic_Title(obj,titledata,type);
		        $(obj).find(".feed-activity-list").attr("id",id);
		        loadfilter_cretia(id);
		        SumInfo.initSearchList(id,url,param,showtype);
		    }};
		    
			var mydate = new Date();
		     var className ="";
		     if(!iFunc.isEmpty(data.task_name)){
		     	className = "divColumn_added_"+mydate.getTime(); 
		     }else if("myfocus"==type){
		     	 var $checkContainer = $("#mod1_main").find("td").find("div.divColumn_added_check_myfocus");
			     if($checkContainer.length>0){
			     	$checkContainer.closest("td").remove();
			     }
		     	 className = "divColumn_added_check_myfocus";
		     }else if("search"==type){
		     	 var $checkContainer = $("#mod1_main").find("td").find("div.divColumn_added_check_search");
			     if($checkContainer.length>0){
			     	$checkContainer.closest("td").remove();
			     }
		     	 className = "divColumn_added_check_search";
		     }
			iScrollColumn.constructFrontBox("mod1_main","",paramOption,className);//向插件最前面新增内容
			iScrollColumn.scrollToLeft("maincontent");//重新定位   
		},
		exchangeHover:function(fa){
			var obj=$(fa).closest(".ibox-title");
			var type=$(obj).find(".showtype").val();
			if(type==""||type=="page"){
				$(fa).attr("title","点击切换为滚动加载");
			}else if(type=="scroll"){
				$(fa).attr("title","点击切换为翻页加载");
			}
		},
		isread:function(obj,type){
			  //var length=$(obj).next(".already").length;
			  var item=$(obj).closest(".feed-element");
			  var id=$(item).find(".data_id").html();
			  var site_name=$(item).find(".site_name").html();
			  var pubtime=$(item).find(".pubtime").html();
			  $.ajax({
						url: "suminfo/isread",
						type: "POST",
						async:true,
						data:{id:id,sitename:site_name,pubtime:pubtime},
						success: function(data){
							if(data=="false"){
								consle("标记已读失败！");
							}else if(data=="success"){
								 $(item).addClass("alreadyread");
							}
						}
			 });
		},
		time_ridio:function(obj,start_Class,end_Class){
			//解除绑定
			$(obj).find( "."+start_Class).datetimepicker('destroy');
			$(obj).find( "."+end_Class ).datetimepicker('destroy');
			//时间控件
			$(obj).find( "."+start_Class ).datetimepicker({
				 showSecond: true,
			     timeFormat: 'HH:mm:ss',
			     hour: 0,
		         minute: 0,
			     second: 0,
			     onClose : function(selectedDate) {
					$(obj).find("."+end_Class).datetimepicker("option", "minDate", selectedDate);
				 },
				 beforeShow:function(){
					var etime=$.trim($(obj).find("."+end_Class).val());
					if(!$.isEmptyObject(etime)){
						$(this).datetimepicker("option", "maxDate", etime);
					}
				},
				format: "yyyy-mm-dd", //选择日期后，文本框显示的日期格式 
    			timeFormat: ''

			});
			$(obj).find("."+end_Class).datetimepicker({
				showSecond: true,
			    timeFormat: 'HH:mm:ss',
			    hour: 23,
		        minute: 59,
		        second: 59,
			    onClose : function(selectedDate) {
					$(obj).find("."+start_Class).datetimepicker("option", "maxDate", selectedDate);
				},
				beforeShow:function(){
					var stime=$.trim($(obj).find("."+start_Class).val());
					if(!$.isEmptyObject(stime)){
						$(this).datetimepicker("option", "minDate", stime);
					}
				},
				format: "yyyy-mm-dd", //选择日期后，文本框显示的日期格式 
    			timeFormat: ''

			});
			//所选时间点击事件，与时间控件互动		zdj
			$(obj).find("[name='timeselecter']").unbind("click").click(function(){
				if($(this).is("checked")&&$(this).val()==-1){
					$(obj).find("[class='time_input']").attr("disabled",true);
				}else{
					$(obj).find("[class='time_input']").attr("disabled",false);
				}
				
			});
		},

		nofindImgSrc:function(obj){
			var sitename=$(obj).attr("data-siteName");
			var img="images/headimg.jpg";
			if(!$.isEmptyObject(sitename)){
				if(sitename=="新浪微博" || sitename=="1"){
					img="images/twitter.jpg";
				}else if(sitename=="人民微博" || sitename=="7"){
					img="images/t_renmin.jpg";
				}else if(sitename=="腾讯微博" || sitename=="3"){
					img="images/t_qq.jpg";
				}else if(sitename=="Twitter" || sitename=="5"){
					img="images/t_twitter.jpg";
				}else if(sitename=="Google+" || sitename=="8"){
					img="images/t_google_plus.png";
				}
			}
			var ele=event.srcElement;
			ele.src=img;
			ele.onerror=null; //控制不要一直跳动
		}
}
