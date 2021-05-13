//url
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"


// Create Map
function createMap(Data) {
  // Color based on depth
  function getColor(depth) {
    if(depth > 90){
      return "#B22222";
    }
    if(depth > 70){
      return "#CD5C5C";
    }
    if(depth > 50){
      return "#F08080";
    }
    if(depth > 30){
      return "#DAA520";
    }
    if(depth > 10){
      return "#FFD700";
    }
    return "#7FFF00";
  }  
  // popup layers
    function onEachFeature(feature, layer) {
        layer.bindPopup("<p>" + feature.properties.title + "</p>" +
            "<p>Magnitude: " + feature.properties.mag + "</p>" +
            "<p>Depth: " + feature.geometry.coordinates[2] + "</p>");
    }
    //circles markers
    let earthquakes = L.geoJSON(Data, {
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {
                radius:feature.properties.mag * 3,
                fillOpacity: .75,
                color: getColor(feature.geometry.coordinates[2])
            })
        },
        onEachFeature: onEachFeature
    });

    var mapLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    });

    var myMap = L.map("mapid", {
        center: [37.0902405,-110],
        zoom: 5,
        layers: [mapLayer, earthquakes]
    });
 
    // *Legend specific*/
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function(map) {
      var div = L.DomUtil.create("div", "legend");
      div.innerHTML = "<h4>Earthquake intensity</h4>"
      + '<i style="background: #7FFF00"></i><span>0-10</span><br>'
      + '<i style="background: #FFD700"></i><span>10-30</span><br>'
      + '<i style="background: #DAA520"></i><span>30-50</span><br>'
      + '<i style="background: #F08080"></i><span>50-70</span><br>'
      + '<i style="background: #CD5C5C"></i><span>70-90</span><br>'
      + '<i style="background: #B22222"></i><span>90+</span><br>';  
      return div;
    };

    legend.addTo(myMap);
};


// Color based on depth
function getColor(depth) {
  switch (true) {
    case depth > 90:
      return "#B22222";
    case depth > 70:
      return "#CD5C5C";
    case depth > 50:
      return "#F08080";
    case depth > 30:
      return "#DAA520";
    case depth > 10:
      return "#FFD700";
    default:
      return "#7FFF00";
  }
}

// Get earthquakes data
d3.json(url, function(data) {
    // Create features with the earthquakes data
    createMap(data.features)
});