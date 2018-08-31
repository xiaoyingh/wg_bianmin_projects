var execI18n = function(){ 
  //获取网站语言(i18nLanguage,默认为中文简体) 
    //国际化页面 
    jQuery.i18n.properties({ 
    	   name:'strings',// 资源文件名称
		   path:'js/i18n/',// 资源文件所在目录路径
		   mode:'both',// 模式：变量或 Map 
		   language:'zh',// 对应的语言
		   cache:false, 
		   encoding: 'UTF-8', 
		   callback: function() {// 回调方法
			    $("#i18ntest").html($.i18n.prop('string_username'));
	       } 
    }); 
} 