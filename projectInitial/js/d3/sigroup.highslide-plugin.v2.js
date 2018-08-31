hs.showCredits = false;
hs.lang = {
	cssDirection: 'ltr',
	loadingText: '载入中...',
	loadingTitle: '取消',
	focusTitle: '置于最前',
	fullExpandTitle: '原始尺寸',
	creditsText: '基于<i>Highslide JS</i>',
	creditsTitle: '查看 Highslide JS 官方首页',
	previousText: '上一张',
	nextText: '下一张',
	moveText: '移动',
	closeText: '关闭',
	closeTitle: '关闭 (退出键)',
	resizeTitle: '调整尺寸',
	playText: '播放',
	playTitle: '播放幻灯片 (空格键)',
	pauseText: '暂停',
	pauseTitle: '暂停幻灯片 (空格键)',
	previousTitle: '上一张 (左方向键)',
	nextTitle: '下一张 (右方向键)',
	moveTitle: '移动',
	fullExpandText: '完整尺寸',
	number: '图片 %1 of %2',
	restoreTitle: '单击关闭图片,单击不放拖动图片。使用方向键进行图片切换。'
};

hs.graphicsDir = 'js/highslide/graphics/';
hs.align = 'center';
hs.transitions = ['expand', 'crossfade'];
hs.fadeInOut = true;
hs.outlineType = 'glossy-dark';
//hs.outlineType = 'rounded-white';
//hs.wrapperClassName = 'dark';
hs.wrapperClassName = 'draggable-header';
hs.dimmingOpacity = 0.8;


//hs.useBox = true;
hs.width = 1100;
hs.height = 800;


/*
hs.Expander.prototype.onAfterClose = function(sender){
	return console.log("close");
}
*/
/*
hs.Expander.prototype.onBeforeExpand = function(sender){
	console.log("before");
}
*/
hs.Expander.prototype.onAfterExpand = function(sender){
	console.log("after");
	var $wrapper = $(sender.wrapper);
	var data_file = $wrapper.find(".data").val();
	if(data_file){
		//var mtchart_02 = new MblogTrackChart($wrapper.find("#chart_expand"), data_file, 1000, null).init();//第一版 
		var mtchart_02 =  new MblogTrackChart($wrapper.find("#chart_expand"), data_file, null, 2, 1000).init();//第二版，添加放大缩小按钮2013.10.8
	}
	return;
}
/*
hs.Expander.prototype.onBeforeClose = function (sender) {
	return confirm("Do you really want to close this nice image?");
}
*/

