var margin = { top: 150, right: 70, left: 70, bottom: 10 };

// var widthT = width,
var widthT = 490,
	widthT = widthT - margin.left - margin.right,
	heightT = 730,
	hegihtT = heightT - margin.top - margin.bottom;

var parseDate = d3.time.format("%m/%d/%y").parse;

var x = d3.time.scale()
	.range([85, widthT]);

// var y = d3.scale.linear()
// 	.domain([4, 40])
// 	.range([heightT, 0]);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.ticks(3);

// var yAxis = d3.svg.axis()
// 	.scale(y)
// 	.orient("left");

var svgT = d3.select("#timeline").append("svg")
		.attr("width", widthT + margin.left + margin.right)
		.attr("height", heightT + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate("+margin.left+","+margin.top+")");

var size = 60;

queue()
  .defer(d3.csv, "monitoring2.csv")
  .defer(d3.csv, "points.csv")
  .await(makeTimeline);

function makeTimeline(error, data) {
	var bg = svgT.append("rect")
				.attr("x", -margin.left)
				.attr("y", -margin.top)
				.attr("width", widthT + margin.left + margin.right)
				.attr("height", heightT + margin.top + margin.bottom)
				// .style("fill", "#f9f6f5")
				// .style("fill", "#000")
				.style("fill", "#010214")
				.style("opacity", 1);

	// svgT.append("line")
	// 	.attr("x1", widthT)
	// 	.attr("y1", 0)
	// 	.attr("x2", widthT)
	// 	.attr("y2", heightT - 200)
	// 	.attr("stroke-width", 0.2)
	// 	.attr("stroke", "rgba(255,255,255,1)");

	data.forEach(function(d) {
		d.date = parseDate(d.date);
	});

	x.domain(d3.extent(data, function(d) { return d.date; }));
	// var extent = d3.extent(data, function(d) { return d.date; });

	svgT.selectAll("circle")
     .data(data)
    .enter()
     .append("circle")
     // .style("fill", "#474b7f")
     .style("fill", function(d) { return getColor(d.group); } )
     .style("opacity", 0.5)
     .attr("r", function(d) { return 3; })
     .attr("cx", function(d) { return x(d.date); })
     .attr("cy", function(d, i) {
     	// console.log(d.group);
     	// return heightT/2-8
     	return getY(d.group);
     });

    // var h = heightT/2 + 8;
    var h = size * 8;

  	svgT.append("g")
  	 .attr("class", "axis")
  	 .attr("transform", "translate(0,"+h+")")
  	 .call(xAxis);

  	var thisGroup;

  	for(var i = 1; i < 8; i++) {

	    svgT.append("text")
	    	.attr('class', 'label')
	        .attr("x", 12)
	        .attr("y", i*size+3.3 )
	        .text( getGroup(i) )
	        // .style("fill", "#000");
	        .style("fill", "rgba(255,255,255,0.8)");
	        // .style("stroke", "rgba(255,255,255,0.5)")
	        // .style("stroke-width", 2);
	        
  		svgT.append("rect")
  		  	.datum({type: "LineString", group: getGroup2(i) }) 
	  			.attr("x", 0)
	  			.attr("y", i*size - 9)
	  			.attr("width", 55)
	  			.attr("height", 18)
	  			.style("fill", "rgba(255,255,255,0.2)")
  			.on("mouseover", function(d){
  				thisGroup = d3.select(this).property("__data__").group;
  				groupSelect(thisGroup);
              // tooltip.text(getGroup2(i));
              // tooltip.style("visibility", "visible");
            })
            .on("mousemove", function(){
              tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
            })
            .on("mouseout", function(d){
            	thisGroup = d3.select(this).property("__data__").group;
            	// console.log(thisGroup);
  				groupReset(thisGroup);
              	// groupReset(getGroup2(i));
              // tooltip.style("visibility", "hidden");
            });;

	    // svgT.append("circle")
	    //     .attr("cx", 0)
	    //     .attr("cy", i*size)
	    //     .attr("r", 12)
	    //     .style("fill", "rgba(255,255,255,0.5)")
	    //     // .style("fill", "none")
	    //     // .style("stroke", "rgba(255,255,255,0.5)")
	    //     // .style("stroke-width", 2);

  	}
}

function getY(group) {
	
	if(group == 'MIT03') { return size*1; }
	else if(group == 'MIT05') { return size*2; }
	else if(group == 'MIT07') { return size*3; }
	else if(group == 'MIT08') { return size*4; }
	else if(group == 'MIT09') { return size*5; }
	else if(group == 'MIT10') { return size*6; }
	else if(group == 'MIT11') { return size*7; }
	// else { return 200; }
}

function getGroup(num) {
	if(num == 1) { return 'MIT  03'}
	else if(num == 2) { return 'MIT  05'}
	else if(num == 3) { return 'MIT  07'}
	else if(num == 4) { return 'MIT  08'}
	else if(num == 5) { return 'MIT  09'}
	else if(num == 6) { return 'MIT  10'}
	else if(num == 7) { return 'MIT  11'}
}

function getGroup2(num) {
	if(num == 1) { return 'MIT03'}
	else if(num == 2) { return 'MIT05'}
	else if(num == 3) { return 'MIT07'}
	else if(num == 4) { return 'MIT08'}
	else if(num == 5) { return 'MIT09'}
	else if(num == 6) { return 'MIT10'}
	else if(num == 7) { return 'MIT11'}
}





