var loadingHtml = "<br><br><br><center><img style='margin:0 auto;' src='/images/ajax-loader.gif' /><br></center><br><br><br>";

//获取当前时分秒
function findNowDetailTime(){
	var now = new Date();
	var hour = now.getHours();
	var minute = now.getMinutes();
	var second = now.getSeconds();
	if(hour<10){ hour = "0"+hour;}
	if(minute<10){ minute = "0"+minute;}
	if(second<10){ second = "0"+second;}
	return  " "+hour+":"+minute+":"+second;
}

//数量超过一万的处理
function  processDataNum(num){
	if(parseInt(num)>10000){
		return parseInt(num/10000)+"万";
	}
	return num;
}
//写cookies
function setCookie(name,value)
{
	var Days = 30;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days*24*60*60*1000);
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
//获取cookie
function getCookie(name)
{
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}
//删除cookie
function delCookie(name)
{
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval=getCookie(name);
	if(cval!=null)
	document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}
//old
/*function setLikeChosen(th){
	var  $con = $(th).next(".chosen-container");
	var lenr = $con.find(".chosen-results .no-results").length;
	
	var a= "";
	//没有搜索到相关的值，则回车将文本赋值到输入框
	if(lenr>0){
		a = $con.find(".chosen-search input").val();
		console.log(a);
		$con.find(".chosen-single  span").html(a);	
	}else{ 
		a = "";
	}
	return  a;
}*/
//处理去掉变量中的双引号
function  removeDquote(d){
	return   d.replace(/\"/g, "");
}
//逗号变成/
function  replaceDou(d){
	return   d.replace(/\,/g, "/");
}

$.getUrlParam = function (name) {  
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");  
    var r = window.location.search.substr(1).match(reg);  
    if (r != null) return unescape(r[2]); return null;  
}


function reWriteChosenSelectArtSource(th){
	var $con = $(th).next(".chosen-container");
	var $sinput = $con.find(".chosen-search input");
	var kcode = "";
    $sinput.keydown(function(){
    //	$con.find(".chosen-single  span").attr("style","color: white;");
    	var a = $sinput.val();
    	kcode = event.keyCode;
		if(event.keyCode=="13"){
			setTimeout(function(){
				keydownArtSource = setLikeChosen(th,a);
				console.log(keydownArtSource+"---keydownArtSource");
			},300);
		}else{
			keydownArtSource = "";
			console.log(keydownArtSource+"---keydownArtSource");
		}
    });
  //手动选择下拉框
    $(th).change(function(){ 
    	console.log(kcode+"-----kcode");
		if(kcode!=13){
			var $con = $(this).next(".chosen-container"); 
			$con.find(".chosen-single  span").attr("style","color: #333;");
		}
		keydownArtSource="";
		console.log(keydownArtSource+"---select----keydownArtSource");
    });
}
function reWriteChosenSelectSigndep(th){
	var $con = $(th).next(".chosen-container");
	var $sinput = $con.find(".chosen-search input");
	var kcode = "";
	$sinput.keydown(function(){
	//	$con.find(".chosen-single  span").attr("style","color: white;");
		var a = $sinput.val();
		kcode = event.keyCode;
		if(event.keyCode=="13"){
			setTimeout(function(){
				keydownSigndep = setLikeChosen(th,a);
				console.log(keydownSigndep+"---keydownSigndep");
			},300);
		}else{
			keydownSigndep = "";
			console.log(keydownSigndep+"---keydownSigndep");
		}
	});
	//手动选择下拉框
	$(th).change(function(){ 
		console.log(kcode+"-----kcode");
		if(kcode!=13){
			var $con = $(this).next(".chosen-container"); 
			$con.find(".chosen-single  span").attr("style","color: #333;");
		}
		keydownSigndep="";	
		console.log(keydownSigndep+"--select-----keydownSigndep");
	});
}
function setLikeChosen(th,a){
	var  $con = $(th).next(".chosen-container");
	$con.find(".chosen-single  span").html(a);	
	$con.find(".chosen-single  span").attr("style","color: #333;");
	return  a;
}
function removeHighlight(th){
	var  $con = $(th).next(".chosen-container");
	$con.find(".chosen-results").find("li").removeClass("result-selected").removeClass("highlighted");
}



function isChinese(temp){
	var reg = /[\u4e00-\u9fa5]/g;//判定中文
	  if (!reg.test(temp)) return false ;
	  return true ;
}

function ShowAndHide(){
	$(".modal_title").unbind("click").click(function(){
		$(".modal_title").removeClass("active").addClass("modal_title_unselect");
		$(this).addClass("active");
		if($(this).attr("by")==1){
			$(".adopt_info_list").show();
			$(".div_adopt_media_account").hide();
		}else{
			$(".adopt_info_list").hide();
			$(".div_adopt_media_account").show();
		}
	});
	//关闭时，再次打开，默认选中第一个tab
	$(".close").click(function(){$(this).next(".modal_title:eq(0)").click();});
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
				mlist1.push('<button class="btn btn-default  btn-lg" type="button" style="cursor: initial;border: 1px solid #5684a3;line-height: 15px;margin-bottom: 10px">'+n.name+'</button>&nbsp;&nbsp;');
			}else if(n.region=="境外"){
				mlist2.push('<button class="btn btn-default  btn-lg" type="button" style="cursor: initial;border: 1px solid #5684a3;line-height: 15px;margin-bottom: 10px">'+n.name+'</button>&nbsp;&nbsp;');
			}
			namelist.push(n.name);
		}
	});
	$div.find("div:eq(0)").html(mlist1);
	$div.find("div:eq(1)").html(mlist2);
}


function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}
function judgeImg(file){
	  var AllImgExt=".jpg|.jpeg|.png|.gif|.bmp|";  
    var extName = file.substring(file.lastIndexOf(".")).toLowerCase();//（把路径中的所有字母全部转换为小写）          
    if(AllImgExt.indexOf(extName+"|")==-1)          
        return false;  
    return true;
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
			mlist.push('<button class="btn btn-default  btn-lg" type="button" style="cursor: initial;border: 1px solid #5684a3;line-height: 15px;margin-bottom: 10px">'+n.name+'</button>&nbsp;&nbsp;');
			namelist.push(n.name);
		}
	});
	$div.html(mlist);
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

//初始化日历
function initCalendar(days){
    var now=new Date();
    var dateBefore= new Date();
    if(days < 30){
        dateBefore.setDate(dateBefore.getDate() - days);
    }else{
        dateBefore.setMonth(dateBefore.getMonth() - Math.floor(days/30));
    }
    var mo = dateBefore.getMonth()+1;
    var da = dateBefore.getDate();
    if(mo<10)  mo = "0"+mo;
    if(da<10)  da = "0"+da;
    
    var tmo = now.getMonth()+1;
    var tda = now.getDate();
    if(tmo<10)  tmo = "0"+tmo;
    if(tda<10)  tda = "0"+tda;
    
    var dateBeforeStr = dateBefore.getFullYear()+"-"+(mo)+"-"+da;
    var nowStr = now.getFullYear()+"-"+(tmo)+"-"+tda;
    return  dateBeforeStr+","+nowStr;
}
//初始化日历
function initCalendar3(days){
	var now=new Date();
	var dateBefore= new Date();
	if(days < 30){
		dateBefore.setDate(dateBefore.getDate() - days);
	}else{
		dateBefore.setMonth(dateBefore.getMonth() - Math.floor(days/30));
	}
	var mo = dateBefore.getMonth()+1;
    var da = dateBefore.getDate();
    if(mo<10)  mo = "0"+mo;
    if(da<10)  da = "0"+da;
    
    var tmo = now.getMonth()+1;
    var tda = now.getDate();
    if(tmo<10)  tmo = "0"+tmo;
    if(tda<10)  tda = "0"+tda;
    
    var dateBeforeStr = dateBefore.getFullYear()+"-"+(mo)+"-"+da;
    var nowStr = now.getFullYear()+"-"+(tmo)+"-"+tda;
    
	
	return  dateBeforeStr+","+nowStr;
}
//初始化日历
function initCalendar2(days){
	var now=new Date();
	var dateBefore= new Date();
	if(days < 30){
		dateBefore.setDate(dateBefore.getDate() - days);
	}else{
		dateBefore.setMonth(dateBefore.getMonth() - Math.floor(days/30));
	}
	var mo = dateBefore.getMonth()+1;
    var da = dateBefore.getDate();
    if(mo<10)  mo = "0"+mo;
    if(da<10)  da = "0"+da;
    
    var tmo = now.getMonth()+1;
    var tda = now.getDate();
    if(tmo<10)  tmo = "0"+tmo;
    if(tda<10)  tda = "0"+tda;
    
    var dateBeforeStr = dateBefore.getFullYear()+"/"+(mo)+"/"+da;
    var nowStr = now.getFullYear()+"/"+(tmo)+"/"+tda;
    
	
	return  dateBeforeStr+","+nowStr;
}

function  validateTime(time){
	time = time.replace("/","-").replace("/","-");
	var a = /^(\d{2})-(\d{2})-(\d{4})$/;
	if(time!=null && time!="" && time!=undefined && !a.test(time)){
		return false;
	}else{
		return true;
	}
}
function CompareTime(st,et){
	var a = new Date(st).getTime();
	var b = new Date(et).getTime();
	if(a>b){
		return true;
	}
}

var Tips = {
		init:function(){
			$('.nameInfo').each(function(){
				$(this).qtip({
					content: $(this).attr('tooltip'), // 使用工具提示属性的元素的内容
					style: 'dark'
				});
			});
		}	
	}

function delHtmlTag(str){
	  return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
	 }

function ScrollTop(){
	$("#totop").hide();
	$(window).scroll(function(){
		if ($(window).scrollTop()>100){
			$("#totop").fadeIn();
		}else{
			$("#totop").fadeOut();
		}
	});
	
	//当点击跳转链接后，回到页面顶部位置
	$("#totop").click(function(){
		$('body,html').animate({scrollTop:0},500);
		return false;
	});
}


function  validateTime3(st){
	//st = st.replace("/","-").replace("/","-");
	var a = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
	if(st!=null && st!="" && st!=undefined && !a.test(st)){
		return false;
	}else{
		return true;
	}
}
function  validateTime2(st){
	//st = st.replace("/","-").replace("/","-");
	var a = /^(\d{4})-(\d{2})-(\d{2})$/;
	if(st!=null && st!="" && st!=undefined && !a.test(st)){
		return false;
	}else{
		return true;
	}
}
//中文，英文，数字：  
function CheckInut(str){
	var reg1 = /[\u4e00-\u9fa5]/g;//判定中文
	var reg2 = /[a-zA-Z]+/;//判定英文
	var reg3 = /[0-9]+/;//判定数字
	//有一个是true,包含中文或者英文或者数字
	if(str.search(reg1)!=-1 || str.search(reg2)!=-1 || str.search(reg3)!=-1){
		return true;
	}else{
		return false;
	}
}
//校验url
function isURL(url) {
//	var strRegex = "^((https|http|ftp|rtsp|mms)://)?[a-z0-9A-Z]{3}\.[a-z0-9A-Z][a-z0-9A-Z]{0,61}?[a-z0-9A-Z]\.com|net|cn|cc (:s[0-9]{1-4})?/$";
	var strRegex = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
	var re = new RegExp(strRegex);
	if (re.test(url)) {
		return true;
	} else {
		return false;
	}
}
//时间区间初始化时间
function intialTime($div,$span){
	get_info_time_info($div,$span);
	//初始化时间
	var ytime= moment().subtract(0,'days').format('YYYY-MM-DD') + '至' + moment().subtract(0,'days').format('YYYY-MM-DD');
	$span.text(ytime);
}
function get_info_time_info($div,$span){
	var cb1 = function (start, end, label) {
        var stime = start.format('YYYY-MM-DD');
        var etime = end.format('YYYY-MM-DD');
        if(label=='不限'){
        	$(".one_day_search").hide();
        	$span.html('');
        }else{
        	if(label=='自定义' && stime!=etime){
        		$(".one_day_search").hide();
        	}else{
        		$(".one_day_search").show();
        	}
        	$span.html(start.format('YYYY-MM-DD') + '至' + end.format('YYYY-MM-DD'));
        }
    }
    var optionSet1 = {
    	startDate: moment().subtract(0, 'days'),
        endDate: moment().subtract(0, 'days'),
        minDate :'2017-04-01',
       // maxDate: moment(),
       // showDropdowns: true,
        //showWeekNumbers: true,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
        	//'不限':[''],
        	'前天': [moment().subtract(2, 'days'), moment().subtract(2, 'days')],
        	'昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            '今天': [moment(), moment()]
        },
        opens: 'right',
        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-small btn-primary',
        cancelClass: 'btn-small',
        format: 'YYYY-MM-DD',
        separator: '至',
        locale: {
            applyLabel: '确定',
            cancelLabel: '关闭',
            fromLabel: '开始时间',
            toLabel: '结束时间',
            customRangeLabel: '自定义',
            daysOfWeek: ['七', '一', '二', '三', '四', '五', '六'],
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            firstDay: 1
        }
    };

    $span.html('');

    $div.daterangepicker(optionSet1, cb1);

    $div.on('show.daterangepicker', function () {});
    $div.on('hide.daterangepicker', function () {});
    $div.on('apply.daterangepicker', function (ev, picker) {});
    $div.on('cancel.daterangepicker', function (ev, picker) {});
}

function conditionToggle(){
	//模块伸展收缩
	$(".collapse-link").unbind("click").click(
			function() {
				var x_panel = $(this).closest('div.ibox');
				var button = $(this).find('i');
				var content = x_panel.find('div.ibox-content');
				content.slideToggle(200);
				(x_panel.hasClass('fixed_height_390') ? x_panel
						.toggleClass('').toggleClass(
								'fixed_height_390') : '');
				(x_panel.hasClass('fixed_height_320') ? x_panel
						.toggleClass('').toggleClass(
								'fixed_height_320') : '');
				button.toggleClass('fa-chevron-up').toggleClass(
						'fa-chevron-down');
				setTimeout(function() {
					x_panel.resize();
				}, 50);
		});
	
}