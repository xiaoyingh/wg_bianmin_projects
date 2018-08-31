
//博主个人博文关键词
function keyworkforoneblogger(container, data, sw, sh, w, h, tw, ty, colorflag){
	var fill = d3.scale.category20();
	var keywords = data;
	var sizes = [];
	var fontSize = d3.scale.log().range([0, 20]);
  	d3.layout.cloud().size([sw, sh])
      .words(keywords.map(function(d,i) {
    	  var fsize = sizes[i];
    	  if(fsize == null){
    	  	  if(container == "bozhu_tag_vs") {
    	  	  	fsize = 350/keywords.length;
        		return {text: d, size: fsize, dx: 0, dy: 50*i};
        	  }
    		  else {
    		  	fsize = 10 + Math.random() * 20;
        		return {text: d, size: fsize};
        	  }
    	  }
      }))
      .rotate(function() {
	      if(container == "bozhu_tag_vs") return 0;
	      else return ~~(Math.random() * 2) * 90;
	  })
      .font("Impact")
    //  .fontSize(function(d) { return d.size; })
      .fontSize(function(d) {  return fontSize(+d.size);  })
      .on("end", draw)
      .start();
  
	function draw(words) {
		d3.select("#"+container)
			.append("svg:svg")
	  	d3.select("#"+container+" svg ")
			.attr("width", w)
			.attr("height", h)
		    .append("g")
	      		.attr("transform", "translate("+tw+","+ty+")")
		    	.selectAll("text")
		    		.data(words)
		    	.enter().append("text")
			    .style("font-size", function(d) { return d.size + "px"; })
			    .style("font-family", "微软雅黑")
			    .style("cursor","pointer")
			    .style("margin","10px")
			    .style("padding","10px")
			    .style("fill", function(d, i) {
			    	if(colorflag == "center") return "#FF6347"; 
			    	else return fill(i);
			    })
			    .attr("text-anchor", "middle")
			    .attr("transform", function(d) {
			    	if(container == "bozhu_tag_vs") 
			    		return "translate(" + [d.dx, d.y] + ")rotate(" + d.rotate + ")";
			    	else
			    	 	return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
			    })
		    	.text(function(d) { return d.text; })
		    	.on("click", function(d) {
			      	if(container == "guanjianci") {
						var blogerUrl = $("div.weibo_bozhu_tabNum").find("input.hidden_blogerUrlN").attr("value");
						var urlKey = $("div.weibo_bozhu_tabNum").find("input.hidden_urlKeyN").attr("value");
						$("#check_qinggan").val(0);
						$("#weibo_bozhu_startTime").val("");
						$("input[name='check_qinggan']").removeAttr("checked");
						$("#weibo_bozhu_endTime").val("");
						$("#rttcount").val("");
						$("#commtcount").val("");
						$("#keyword").val(d.text);
						scrollPagination($("#W_bozhu_analysis_list"), "blogerInfoQuery.y?method=weibo__bz__analysis_list&blogerUrl="
							 				+ blogerUrl+"&urlKey="+urlKey+"&keyword="+d.text);
						$("#bozhu_tabNum").Tabs(0);
					}
			    });
	}
}

//关键词--生成父页
function keywordfather(container, data, sw, sh, w, h, tw, ty, colorflag){
	var fill = d3.scale.category20();
	var keywords = data;
	var sizes = [];
  	d3.layout.cloud().size([sw, sh])
      .words(keywords.map(function(d,i) {
    	  var fsize = sizes[i];
    	  if(fsize == null){
    	  	  if(container == "bozhu_tag_vs") {
    	  	  	fsize = 350/keywords.length;
        		return {text: d, size: fsize, dx: 0, dy: 50*i};
        	  }
    		  else {
    		  	fsize = 10 + Math.random() * 20;
        		return {text: d, size: fsize};
        	  }
    	  }
      }))
      .rotate(function() {
	      if(container == "bozhu_tag_vs") return 0;
	      else return ~~(Math.random() * 2) * 90;
	  })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();
  
	function draw(words) {
		d3.select("#"+container)
			.append("svg:svg")
	  	d3.select("#"+container+" svg ")
			.attr("width", w)
			.attr("height", h)
		    .append("g")
	      		.attr("transform", "translate("+tw+","+ty+")")
		    	.selectAll("text")
		    		.data(words)
		    	.enter().append("text")
			    .style("font-size", function(d) { return d.size + "px"; })
			    .style("font-family", "微软雅黑")
			    .style("margin","10px")
			    .style("padding","10px")
			    .style("fill", function(d, i) {
			    	if(colorflag == "center") return "#FF6347"; 
			    	else return fill(i);
			    })
			    .attr("text-anchor", "middle")
			    .attr("transform", function(d) {
			    	if(container == "bozhu_tag_vs") 
			    		return "translate(" + [d.dx, d.y] + ")rotate(" + d.rotate + ")";
			    	else
			    	 	return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
			    })
		    	.text(function(d) { return d.text; })
	}
}

//关键词--生成子页
function keywordson(container, data, sw, sh, tw, ty, colorflag){
	var fill = d3.scale.category20();
	var keywords = data;
	var sizes = [];
  	d3.layout.cloud().size([sw, sh])
      .words(keywords.map(function(d,i) {
    	  var fsize = sizes[i];
    	  if(fsize == null){
    		  fsize = 10 + Math.random() * 35
    	  }
        return {text: d, size: fsize};
      }))
      .rotate(function() { return ~~(Math.random() * 2) * 90;; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();
	
	function draw(words) {
	  	d3.select("#"+container+" svg ")
		    .append("g")
	      		.attr("transform", "translate("+tw+","+ty+")")
		    	.selectAll("text")
		    		.data(words)
		    	.enter().append("text")
			    .style("font-size", function(d) { return d.size + "px"; })
			    .style("font-family", "微软雅黑")
			    .style("margin","30px")
			    .style("padding","30px")
			    .style("fill", function(d, i) { 
			    	if(colorflag == "left") return "#1C86EE";
			    	else if (colorflag == "right") return "#66CD00";
			    	else return fill(i);
			    })
			    .attr("text-anchor", "middle")
			    .attr("transform", function(d) {
			    	return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
			    })
		    	.text(function(d) { return d.text; })
	}
}

function chk(num){ 
	return num?num%2?false:true:"0" 
}

function countrandom(size) {
	return ~~(Math.random() * 2) * size;
}
	
function rand(num){
	return parseInt(Math.random()*num+1);
}

function randomcolor(){
	var str=Math.ceil(Math.random()*16777215).toString(16);
	if(str.length<6){
	  str="0"+str;
	}
	return str;
}