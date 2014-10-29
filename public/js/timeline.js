var margin = { top: 10, right: 360, left: 360, bottom: 10 };

var widthT = width,
	widthT = widthT - margin.left - margin.right,
	heightT = 110,
	hegihtT = heightT - margin.top - margin.bottom;

var parseDate = d3.time.format("%m/%d/%y").parse;

var x = d3.time.scale()
	.range([0, widthT]);

// var y = d3.scale.linear()
// 	.domain([4, 40])
// 	.range([heightT, 0]);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom");

// var yAxis = d3.svg.axis()
// 	.scale(y)
// 	.orient("left");

var svgT = d3.select("#timeline").append("svg")
		.attr("width", widthT + margin.left + margin.right)
		.attr("height", heightT + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate("+margin.left+","+margin.top+")");

queue()
  .defer(d3.csv, "monitoring2.csv")
  .defer(d3.csv, "points.csv")
  .await(makeTimeline);

function makeTimeline(error, data) {
	// var bg = svgT.append("rect")
	// 			.attr("x", -margin.left)
	// 			.attr("y", -margin.top)
	// 			.attr("width", widthT + margin.left + margin.right)
	// 			.attr("height", heightT + margin.top + margin.bottom)
	// 			.style("fill", "#fff")
	// 			.style("opacity", 0.4);

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
     .style("opacity", 1)
     .attr("r", function(d) { return 3.6; })
     .attr("cx", function(d) { return x(d.date); })
     .attr("cy", heightT/2);

  	svgT.append("g")
  	 .attr("class", "axis")
  	 .attr("transform", "translate(0,"+heightT/2+
  	 	")")
  	 .call(xAxis);
}








