// Ref: Assignment activites

// Create a map object.
let myMap = L.map("map", {
    center: [45.50, -114.86],
    zoom: 5
  });
  
  // Add a tile layer.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: "&copy;<a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> <a href='https://www.mapbox.com/contribute/#/'>Improve this map</a>"
  }).addTo(myMap);

// A function to determine the marker size based on the magnitude
function markerSize(mag) {
    return mag * 3;
  }

// A function that returns color based on depth
function magnitudeColor(depth) {
    var magcolor = "";
    if (depth > 90) {
      return magcolor = "red";
    }
    else if (depth >= 70) {
      return magcolor = "darkorange";
    }
    else if (depth > 50) {
      return magcolor = "orange";
    }
    else if (depth > 30) {
    //   return magcolor = "#FAC286";
      return magcolor = "#FACB11";
    }
    else if (depth > 10) {
      return magcolor = "greenyellow";
    }
    else if (depth > -10) {
      return magcolor = "limegreen";
    }
    else {
    //   return magcolor = "#FFEC00";
    return magcolor = "grey";
    }
  }
// Get the URL for past 7 days from USGS site
let earthquake_data_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
// Perform a GET request to the earthquake data url/
d3.json(earthquake_data_url).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});
//-------start - A function that creates features using earthquake data
function createFeatures(earthquakeData) {
  // Create a GeoJSON layer containing the features array
  // Each feature a popup describing the place and time of the earthquake
  L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, 
        {
          radius: markerSize(feature.properties.mag),
          fillColor: magnitudeColor(feature.geometry.coordinates[2]),
          fillOpacity: 0.75,
          color: "darkgrey",
          stroke: true,
          weight: 1.5,
          opacity: 1
        }
      );
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<strong>Location: " + feature.properties.place + "</strong><hr><p>Date: " + new Date(feature.properties.time) + "</p><hr><p>Depth: " + feature.geometry.coordinates[2] + "</p><p>Magnitude: " + feature.properties.mag + "</p>");
    }
  }).addTo(myMap);

// Create a legend that will provide context of the map data
let legend = L.control({position: 'bottomright'});

legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'legend');
    var depthLevel = [-10, 10, 30, 50, 70, 90];
    var labels = [];

    // Loop through each depthLevel item and color the legend
    for (var i = 0; i < depthLevel.length; i++) {
        labels.push('<ul style="background:' + magnitudeColor(depthLevel[i]+1) + '"><span>' + depthLevel[i] + (depthLevel[i + 1] ? '&ndash;' + depthLevel[i + 1] + '' : '+') + '</span></ul>');
    }
    // add each label list item to the div under the <ul> tag
    div.innerHTML += "<ul>" + labels.join("")+ "</ul>";
    return div;
  };
  legend.addTo(myMap);
}