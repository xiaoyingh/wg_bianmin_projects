function draw_newwork_D3(id,graph){
	
var width = parseInt($("#"+id).css("width")),
	height = parseInt($("#"+id).css("height"));

var color = d3.scale.category20();

var force = d3.layout.force().linkDistance(100).linkStrength(2).charge(-300).size([width, height]);

var svg = d3.select("#"+id).append("svg").attr("width", width).attr("height", height);

// 背景
    d3.select("#"+id).transition().style("background-color", "grey");

var nodes = graph.nodes.slice(),
	links = [],
	bilinks = [];

graph.links.forEach(function(link) {
	var s = link.source,
		t = link.target,
		i = {}; // intermediate node
    v = link.value;
	nodes.push(i);
	links.push({
		source: s,
		target: i
	}, {
		source: i,
		target: t
	});
	bilinks.push([s, i, t ,v ]);
});

force.nodes(nodes).links(links).start();

var link = svg.selectAll(".link").data(bilinks)
                  .enter().append("path")
                  .attr("class","link")
                  .style("stroke", function(d) { 
                    if(d[3] != null) { 
                      if(d[3] == "1"){
                        return color("1");
                      }else{
                        return color("2");
                      }
                    }; 
                  });

var node = svg.selectAll(".node").data(graph.nodes)
                  .enter().append("g")
                  .attr("class", "node")
                  .call(force.drag);

              //小圆   2.5-7.5
              node.append("circle").attr("class", "node")
              .attr("r", function(d){
                /*console.log(d.count/2)
                if(d.count/2<2){
                  return 2.5;
                }else{
                  return d.count/2;
                }*/
				return d.count;
              })              
              .style("fill", function(d) {
                return color(d.count+"")
              });


node.append("text")
	.attr("dx", 12)
	.attr("dy",".35em")
	.attr("class","text")
	.text(function(d) {
		return d.name
	});

force.on("tick", function() {
	link.attr("d", function(d) {
	  return "M" + d[0].x + "," + d[0].y + "S"
		  + d[1].x + "," + d[1].y + " "
		  + d[2].x + "," + d[2].y;
	});
	node.attr("transform",function(d) {
	  return "translate(" + d.x + "," + d.y + ")";
	});
});
}