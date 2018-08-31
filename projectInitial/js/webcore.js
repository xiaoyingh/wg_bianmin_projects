$(function(){
	modelLoad();
})
//_loc_done 加载完成，会有这个属性
//lazy 即延迟加载，手动触发
function modelLoad($node,jsonParam){
	var $nm;
	if($node==null){
		$nm=$("[_loc]");
	}else{
		$nm=$("[_loc]",$node);
	}
	
	$nm.each(function(){
		if(!("true"==$(this).attr("lazy"))){
			var param={};
			if(jsonParam!=null){
				param=jsonParam;
			}
			var _loc_done=$(this).attr("_loc_done");
			if(_loc_done!="true"){
				$(this).append("<img style='display:block;margin:100px auto;' src='/img/ajax-loader.gif' />")
				$(this).load($(this).attr("_loc")+window.location.search,param,function(){// jQuery.parseJSON($(".globalparam").val()),
					//peityload();
					console.log($(this).attr("_loc"))
					$(this).attr("_loc_done","true")
					if($("[_loc]",$(this)).size()>0){
						modelLoad();
					}
				})
			}
		}
	})
}

function modelSoloLoad($node,jsonParam){
	$node.removeAttr("lazy")
	$node.removeAttr("_loc_done")
	modelLoad(null,jsonParam)
}

$(function(){
	$(".metismenu li[class='active']").attr('class','');
	$(".metismenu [href='"+window.location.pathname+"']").parent().addClass('active');
	$(".metismenu [href='"+window.location.pathname+"']").parent().parent().parent().addClass('active');
	if($(".collapse",$(".metismenu [href='"+window.location.pathname+"']").parent().parent().parent()).size()==1){
		$(".collapse",$(".metismenu [href='"+window.location.pathname+"']").parent().parent().parent()).addClass("in");
	}
})


/*******************************************************************************
 * http://lisperator.net/uglifyjs/compress
 * http://www.javascriptobfuscator.com/Javascript-Obfuscator.aspx var
 ******************************************************************************/