//绘制微博的有向的传播路径图
function slider(container,containerDisplay, data,width,height,slideDuration,autoPlay,callback) {
	this.container =container;	//容器
	this.containerDisplay =containerDisplay;	//容器
	this.values=data;  //json数组
	this.width = (width == undefined || width == null ? this.container.width() : width);					//图尺寸
	this.height = (height == undefined || height == null ? this.container.height() : height);					//图尺寸
	this.slideDuration = slideDuration;//ms为单位
	this.autoRewind = true;
	this.playInterval = null;
	this.currentSlide = 0;
	this.autoPlay = autoPlay;
	this.callback = callback;
}
slider.prototype.init = function(){
	var obj = this;
	$("#"+obj.container).empty();
	obj.genChart();
	return obj;
}

slider.prototype.genChart = function(){
	var obj = this;
	$( "#"+obj.container).slider({
        value: 0,
        min: 0,
        max: obj.values.length-1,
        step: 1,
        slide: function( event, ui ) {
            obj.setSlide(ui.value);
        }
	});
	obj.play();
	if(obj.autoPlay)
		$("#play").click();
}



//播放动作
slider.prototype.play =function(){
	var obj = this;
	 $( "#play" ).button({
	      icons: {
	        primary: "ui-icon-play"
	      },
	      text: false
	    }).click(function () {
	        if (obj.playInterval != undefined) {
	            clearInterval(obj.playInterval);
	           obj.playInterval = undefined;
	            $(this).button({
	                icons: {
	                    primary: "ui-icon-play"
	                }
	            });
	            return;
	        }
	        $(this).button({
	            icons: {
	                primary: "ui-icon-pause"
	            }
	        });
	        obj.playInterval = setInterval(function () {
	            obj.currentSlide++;
	            if (obj.currentSlide > obj.values.length) {
	                if (obj.autoRewind) {
	                    obj.currentSlide = 0;
	                }
	                else {
	                    clearIntveral(obj.playInterval);
	                    return;
	                }
	            }
	            obj.setSlide(obj.currentSlide);
	        }, obj.slideDuration);
	    });
}

//play过程中，赋值给slide
slider.prototype.setSlide =function(index){
	var obj = this;
	if(index==obj.values.length){
		index=0;
	}
   obj.currentSlide = index;
	var jsonData = obj.values[obj.currentSlide];
	if(obj.callback){
		obj.callback();
	}
//$(".ui-slider-handle").html(obj.currentSlide);
  $( "#"+obj.container ).slider( "value", obj.currentSlide );
  $( "#"+obj.containerDisplay).html(obj.values[obj.currentSlide].pubtime );
}
