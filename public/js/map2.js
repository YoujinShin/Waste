var width = 1440, // 1440 window
    height = 690; // 540, 730

// var projection = d3.geo.orthographic()
var projection = d3.geo.equirectangular()
// var projection = d3.geo.mercator()
    // .scale(280) //153 // 190
    // .rotate([160, 0]) // 160,0
    // .translate([width/2+160, 440])
    // .precision(0.02); //.1

    .scale(247) // 340, 270
    .rotate([160, 0]) // 160,0
    .translate([width/2-10, 590])
    .precision(0.02); //.1

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule();

// var zoom = d3.behavior.zoom()
//     .scaleExtent([1, 3])
//     .on("zoom", zoomed);


var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g");

// svg.call(zoom)
//    .call(zoom.event);

var animation = g.append("circle")
    .attr("r", 11)
    .style("fill", "rgba(0,0,0,0)")
    // .style("fill", "#f17830")
    // .style("opacity", 0)
    // .style("stroke", "#faf733")// yellow
    // .style("stroke", "#f17830")// orange
    .style("stroke", "#fff")
    .style("opacity", 0.4)
    .style("stroke-width", 4)
    .style("visibility", "hidden");
    // .attr("transform", "translate(0,0)");

// svg.append("path")
g.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

// d3.json("world-110m.json", function(error, world) {
d3.json("world-50m.json", function(error, world) {
  // svg.insert("path", ".graticule")
  g.insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);

  // svg.insert("path", ".graticule")
  g.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path);
});

d3.select(self.frameElement).style("height", height + "px");

///////////
queue() 
  .defer(d3.csv, "monitoring2.csv")
  .defer(d3.csv, "points.csv")
  .await(makeMap);

function obj(lon, lat) { return  [lon, lat]; }

// var tooltip = d3.select("#map")
var tooltip = d3.select("#timeline")
  .append("div")
  .attr("id", "tooltip");


function makeMap(error, data, points) {
  // PATHS
  for(var i = 0; i < data.length; i++ ) {
    if(i > 1) {
      var start_group = data[i].group;
      var end_group = data[i-1].group;

      var start = obj(parseFloat(data[i].lon), parseFloat(data[i].lat));
      var end = obj(parseFloat(data[i-1].lon), parseFloat(data[i-1].lat));

      if( determineData(start[0], end[0], start_group, end_group) == true ) { 
        // svg.append("path")
        g.append("path")
            // .datum({type: "LineString", coordinates: [start, end], name: start_group}) // datum
            .datum({type: "LineString", coordinates: [end, start], name: start_group})
            .attr("class", "arc")
            .attr("d", path)
            .style("stroke", getColor(start_group))
            .style("opacity", 0.7);
            // .on("mouseover", function(d){
            //   groupSelect(d.name);

            //   // svgT.selectAll("rect").each(function(e) {
            //   //   // console.log(e.group);
            //   //   if(e.group == d.name) {
            //   //     console.log(e.group);
            //   //   }
            //   // });
            //   // tooltip.text(d.name);
            //   // tooltip.style("visibility", "visible");
            // })
            // .on("mousemove", function(){
            //   // tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
            // })
            // .on("mouseout", function(d){
            //   groupReset(d.name);
            //   // tooltip.style("visibility", "hidden");
            // });
            
      } // determineData();
    } // i >1
  }// for

  // CIRCLES
  g.selectAll("circle")
  // svg.selectAll("circle")
     .data(points)
     .enter()
     .append("circle")
     // .style("fill", "#474b7f")
     // .style("fill", "#fff")
     .style("fill", function(d) { return getColor2(d.country); })
     .style("opacity", 0.6)
     .attr("r", function(d) { return d.r; })
     .attr("transform", function(d) {
      return "translate("+
        projection([ parseFloat(d.lon), parseFloat(d.lat) ])  // lon, lat
      + ")"
     });

  g.selectAll("text")
  // svg.selectAll("text")
     .data(points)
     .enter()
     .append("text")
     .attr("class", "memo")
     .text(function(d) { return d.loc; })
     // .style("visibility", function(d) {
     //    if(d.loc == 'Los Angeles, CA') { return "visible"; }
     //    else { return "hidden"; }
     // })
     .attr("fill", "rgba(255,255,255,0.6)") //555
     .attr("transform", function(d) {
      var lon = parseFloat(d.lon) + parseFloat(d.lon_d2) ;
      var lat = parseFloat(d.lat) + parseFloat(d.lat_d2);

      return "translate("+ projection([ lon, lat ]) + ")";
     });

};// ready


var combinedD = "";
var combinedPath = g.append("path")
                    .style("fill", "none")
                    .datum({type: "LineString", name: ""});

function groupSelect(name) {
  // svg.selectAll("circle").style("opacity", 1);
  combinedD = "";

  // svg.selectAll("path").each(function(e) {
  var check = 0;

  g.selectAll("path").each(function(e) {
    
    // console.log(e.name);
    if(determinePath(e.name) == true) {
      if(e.name == name) {
        // console.log(name);

        d3.select(this).style("stroke", "#fff");
        d3.select(this).style("opacity", 0.8);
        
        d3.select(this).transition().duration(300)
          .style("stroke-width", 2.2);
        d3.select(this).moveToFront();

        combinedD = combinedD + d3.select(this).attr("d");

        // if(check == 1) transition(d3.select(this));
        // console.log(check);
        // check++;
      } else {
        d3.select(this).style("stroke", "rgba(100,100,100,0.0)");
      }     
    }

  });

  // check = 0;
  animation.style("visibility", "visible");
  combinedPath.attr("d", combinedD);
  transition(combinedPath);

  svgT.selectAll("circle").each(function(e) {
    if(e.group == name) {
      // console.log(e.group);
      d3.select(this)
        .transition().duration(300)
        .attr("r", 6);
      d3.select(this).style("opacity", 0.9);
      d3.select(this).moveToFront();
    } else {
      // d3.select(this).style("fill", "rgba(180,180,180,0.9)");
    }
  });
}

function groupReset(name) {
  // svg.selectAll("circle").style("opacity", 0.7);
  // svg.selectAll("path").each(function(e) {
  animation.style("visibility", "hidden");
  
  g.selectAll("path").each(function(e) {
    if(determinePath(e.name) == true) {
      // if(e.name == name) {
        // console.log(e.name);
        d3.select(this).style("stroke", "#fff");
        d3.select(this).style("opacity", 0.7);
        // d3.select(this).style("stroke-width", 1);

        d3.select(this).transition().duration(0)
          .style("stroke-width", 1);
        // d3.select(this).moveToFront();
      // }
    }
  });

  combinedD = "";
  // animation.attr("transform", "translate(0,100)");

  svgT.selectAll("circle").each(function(e) {
    d3.select(this)
      .transition().duration(0)
      .attr("r", 2.2);

    d3.select(this).style("opacity", 0.9);
    d3.select(this).style("fill", getColor2(e.country) );
  });
}

function determineData(a, b, c, d) {
  // if (c == d) {
  //   return true;
  // } else {
  //   return false;
  // }

  if (a != b & c == d) {
    return true;
  } else {
    return false;
  }
}

function determinePath(group) {
  if (group == 'MIT03') return true;
  else if(group == 'MIT09') return true;
  else if(group == 'MIT07') return true;
  else if(group == 'MIT10') return true;
  else if(group == 'MIT05') return true;
  else if(group == 'MIT08') return true;
  else if(group == 'MIT11') return true;
  else return false;
}

function getColor(group) {
  return '#fff';
  // blue - high line
  // if (group == 'MIT03') return '#7e95ac';
  // else if(group == 'MIT09') return '#6b7b93';

  // // red - middle line
  // else if(group == 'MIT07') return '#cb536b';
  // else if(group == 'MIT10') return '#ef6a30';

  // // green -  low line
  // else if(group == 'MIT05') return '#599110';

  // // in US only
  // else if(group == 'MIT08') return '#b7342f';
  // else if(group == 'MIT11') return '#353537';
}

function getColor2(country) {
  if(country == 'us') { return '#fff'; }
  else if(country == 'china'){ return '#ed4a4b'; }
  else if(country == 'malaysia') { return '#41b6fb'; }
}


///////////
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

////////// zoom
// function zoomed() {
//   g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
// }

// d3.select(self.frameElement).style("height", height + "px");


/////////// animation

function transition(this_path) {
  animation.transition()
      .duration(1900)
      .attrTween("transform", translateAlong(this_path.node()));
      // .each("end", transition);

  animation.moveToFront();
}

// Returns an attrTween for translating along the specified path element.
function translateAlong(this_node) {
  var l = this_node.getTotalLength();
  return function(d, i, a) {
    return function(t) {
      var p = this_node.getPointAtLength(t * l);
      return "translate(" + p.x + "," + p.y + ")";
    };
  };
}


//***********************************************************
// PAN-ZOOM CONTROL - FUNCTIONAL STYLE
//***********************************************************
var makePanZoomCTRL = function(id, width, height) {
  var control = {}

  var zoomMin = 1, // Levels of Zoom Out
      zoomMax = 4, // Levels of Zoom In
      zoomCur = 0, // Current Zoom
      offsetX = 0, // Current X Offset (Pan)
      offsetY = 0; // Current Y Offset (Pan)

  var transform = function () {
    var x = -((width  * zoomCur / 10) / 2)  + offsetX;
    var y = -((height * zoomCur / 10) / 2)  + offsetY;
    var s = (zoomCur / 10) + 1;
    d3.select(id)
      .attr("transform", "translate(" + x + " " + y + ") scale(" + s + ")");
  };

  control.pan = function (btnID) {
    if (btnID === "panLeft") {
      offsetX += 50;
    } else if (btnID === "panRight") {
      offsetX -= 50;
    } else if (btnID === "panUp") {
      offsetY += 50;
    } else if (btnID === "panDown") { 
      offsetY -= 50;
    }
    transform();
  };

  control.zoom = function (btnID) {
    if (btnID === "zoomIn") {
      if (zoomCur >= zoomMax) return;
      zoomCur++;
    } else if (btnID === "zoomOut") {
      if (zoomCur <= zoomMin) return;
      zoomCur--;
    }
    transform();
  };
  return control;
}

//***********************************************************
// INSTANTIATE PAN-ZOOM CONTROL (CREATE INSTANCE)
//***********************************************************
var panZoom = makePanZoomCTRL('g', width, height);

//***********************************************************
// SET BUTTON EVENT LISTENERS
//***********************************************************
d3.selectAll("#zoomIn, #zoomOut")
  .on("click", function () {
    
    d3.event.preventDefault();
    var id = d3.select(this).attr("id");

    // console.log("zoom control clicked");
    // console.log(id);
    
    panZoom.zoom(id);
  });

// d3.selectAll("#panLeft, #panRight, #panUp, #panDown")
//   .on("click", function () {
    
//     d3.event.preventDefault();
//     var id = d3.select(this).attr("id");

//     // console.log("pan congrol clicked");
//     // console.log(id);

//     panZoom.pan(id);
//   });
