var margin = { top: 0, right: 70, left: 36, bottom: 20 };

// var widthT = width,
var widthT = 380,
	widthT = widthT - margin.left - margin.right,
	heightT = 345,
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

var size = 42;

queue()
  .defer(d3.csv, "monitoring2.csv")
  .defer(d3.csv, "points.csv")
  .await(makeTimeline);

function makeTimeline(error, data) {
	var bg = svgT.append("rect")
				.datum({type: "LineString", group: "" })
				.attr("x", -margin.left)
				.attr("y", -margin.top)
				.attr("width", widthT + margin.left + margin.right)
				.attr("height", heightT + margin.top + margin.bottom)
				// .style("fill", "#f9f6f5")
				// .style("fill", "#000")
				.style("fill", "#010214")
				.style("opacity", 0.3);

	data.forEach(function(d) {
		d.date = parseDate(d.date);
	});

	x.domain(d3.extent(data, function(d) { return d.date; }));

	svgT.selectAll("circle")
     .data(data)
    .enter()
     .append("circle")
     // .style("fill", "#474b7f")
     .style("fill", function(d) { return getColor2(d.country); } )
     .style("opacity", 0.9)
     // .style("stroke", '#000')
     // .style("stroke-width", 1)
     .attr("r", function(d) { return 2.8; })
     .attr("cx", function(d) { return x(d.date); })
     .attr("cy", function(d, i) { return getY(d.group); })
     .on("mouseover", function(d){
     	d3.select(this).attr("r", 6);
     	// tooltip.text(d.group +", "+d.country+", "+d.date);
     	tooltip.text(d.address);
     	tooltip.style("visibility", "visible");
     })
     .on("mousemove", function(){
     	tooltip.style("top", (event.pageY-35)+"px").style("left",(event.pageX-3)+"px");
     })
     .on("mouseout", function(d){
     	d3.select(this).attr("r", 2.8);
     	tooltip.style("visibility", "hidden");
     });

    var h = size * 7 + 25;

  	svgT.append("g")
  	 .attr("class", "axis")
  	 .attr("transform", "translate(0,"+h+")")
  	 .style("text-anchor", "start")
  	 .call(xAxis);

  	var thisGroup;

  	for(var i = 1; i < 8; i++) {
  		svgT.append("line")
	    	.attr('class', 'label')
	        .attr("x1", 85)
	        .attr("y1", i*size )
	        .attr("x2", widthT)
	        .attr("y2", i*size)
	        .style("visibility", "visible")
	        // .style("stroke-dasharray", ("1, 7")) 
	        // .style("stroke", "rgba(255,255,255,1)")
	        .style("stroke", "red")
	        .style("stroke-width", 5);

	    svgT.append("text")
	    	.attr('class', 'label')
	        .attr("x", 10)
	        .attr("y", i*size+3.3 )
	        .text( getGroup(i) )
	        // .style("fill", "#000");
	        .style("fill", "rgba(255,255,255,0.8)");
	        // .style("stroke", "rgba(255,255,255,0.5)")
	        // .style("stroke-width", 2);

  		svgT.append("rect")
  		  	.datum({type: "LineString", group: getGroup2(i) }) 
	  			.attr("x", -2)
	  			.attr("y", i*size - 9)
	  			.attr("width", 55)
	  			.attr("height", 18)
	  			// .style("fill", "rgba(255,255,255,0.2)")
	  			.style("fill", "#fff")
	  			.style("opacity", 0.15)
	  		// .on("click", function(d) {
	  		// 	console.log(d);
		   //   	thisGroup = d3.select(this).property("__data__").group;
  			// 	groupSelect(thisGroup);
  			// 	d3.select(this).style("opacity", 0.4);
		   //   })
  			.on("mouseover", function(d){
  				thisGroup = d3.select(this).property("__data__").group;
  				groupSelect(thisGroup);
  				d3.select(this).style("opacity", 0.4);

  		// 		// Returns width of browser viewport
				// console.log("browser: "+$( window ).width());	
				// // Returns width of HTML document
				// console.log("html: "+$( document ).width());
				// console.log("body: "+ $( "body" ).width());
				// console.log("");
            })
            .on("mousemove", function(){
              // tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
            })
            .on("mouseout", function(d){
      //       	thisGroup = d3.select(this).property("__data__").group;
  				groupReset(thisGroup);
  				d3.select(this).style("opacity", 0.15);
            });     
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




