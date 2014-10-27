L.mapbox.accessToken = 'pk.eyJ1Ijoic2Vuc2VhYmxlIiwiYSI6ImxSNC1wc28ifQ.hst-boAjFCngpjzrbXrShw';

var map = L.map('map', {
  minZoom: 2,
  maxZoom: 10,
  zoomControl: false
}).setView([30, 0], 2); //30, -20

// var base_layer = L.mapbox.tileLayer('examples.map-20v6611k').addTo(map); // grey 
// ('examples.map-zswgei2n'); // color
// ('examples.map-20v6611k'); // grey 
// ('examples.map-h67hf2ic'); // white
// ('examples.map-2k9d7u0c'); // satellite
// ('examples.map-y7l23tes'); // dark
// ('examples.map-h68a1pf7'); // pink
// ('examples.map-8ced9urs'); // black & white

var base_layer = L.mapbox.tileLayer('examples.map-2k9d7u0c');
base_layer.setOpacity(0.7);
base_layer.addTo(map);

queue()
  .defer(d3.csv, "monitoring2.csv")
  .await(ready);

function obj(lon, lat) { return { x: lon, y: lat }; } // x:lon, y:lat

function ready(error, data) {
  for(var i = 0; i < data.length; i++ ) {

    if(i > 1) {
      // console.log(i);
      var start_group = data[i].group;
      var end_group = data[i-1].group;

      var start = obj(parseFloat(data[i].lon), parseFloat(data[i].lat));
      var end = obj(parseFloat(data[i-1].lon), parseFloat(data[i-1].lat));

      if( determineData(start.x, end.x, start_group, end_group) == true ) { 
        console.log('draw !');
        var generator = new arc.GreatCircle(start, end);

        var line = generator.Arc(90, {offset: 10 });
        // console.log(line.json());

        L.geoJson(line.json(), {
          color: getColor(start_group),
          weight: 1,
          opacity: 1
        }).addTo(map);
      } // determineData();

    } // i >1
  }// for

};// ready

function determineData(a, b, c, d) {
  console.log('a: '+a);
  console.log('b: '+b);
  console.log('c: '+c);
  console.log('d: '+d);

  if (a != b & c == d) {
    return true;
  } else {
    return false;
  }
}

function getColor(group) {
  if (group == 'MIT03') return 'red';
  else if(group == 'MIT05') return 'blue';
  else if(group == 'MIT07') return 'yellow';
  else if(group == 'MIT08') return 'orange';
  else if(group == 'MIT09') return 'white';
  else if(group == 'MIT10') return 'purple';
  else if(group == 'MIT11') return 'green';
}
  
