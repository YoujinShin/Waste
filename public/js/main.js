var margin = { top:30, right:60, bottom:40, left:40 };

var width = 1000;
// var width = parseInt(d3.select('#viz').style('width'), 10),
    width = width - margin.left - margin.right,

    height = 400;
    height = height - margin.top - margin.bottom;

// var x = d3.time.scale()
//     .range([0, width]);

// var y = d3.scale.linear()
//     .domain([0, 3800])
//     .range([height, 0]);

// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom");

// var yAxis = d3.svg.axis()
//     .scale(y)
//     .orient("left");

// var cum_ebola_case = d3.map();
// var cum_ebola_death = d3.map();

// var parseDate = d3.time.format("%Y-%m-%d").parse; 
// var parseDate = d3.time.format("%m/%d/%y").parse;

var svg = d3.select("#map").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

queue()
  .defer(d3.csv, "monitoring2.csv")
  .await(ready);

function ready(error, data) {
	// console.log(data);
	data.forEach(function(d) {
		console.log(d.group+": "+d.lat+", "+d.lon);
	})
  // var bg = svg.append("rect")
  //             .attr("x", -margin.left)
  //             .attr("y", -margin.top)
  //             .attr("width", width + margin.left + margin.right)
  //             .attr("height", height + margin.top + margin.bottom)
  //             .style("fill", "none");

  // data.forEach(function(d) {  
  //   d.Date = parseDate(d.Date);  

    // if(d.Country == 'Guinea') {
    //   console.log(d.Value);
    //   current_guinea = d.Value;
    // }
    // else if(d.Country == 'Sierra Leone') current_sierraleone = d.Value;
    // else if(d.Country == 'Negeria') current_nigeria = d.Value;
    // else if(d.Country == 'Liberia') current_liberia = d.Value;
    // else if(d.Country == 'Senegal') current_senegal = d.Value;
};

  
