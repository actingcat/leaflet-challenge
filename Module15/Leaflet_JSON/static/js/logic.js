function init() {
  let earthquakes= L.layerGroup();
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson").then((data)=> {
    L.geoJSON(data.features, {
      onEachFeature: function (feature, layer) {
        let magnitude= feature.properties.mag;
        let size= magnitude;
        let depth= feature.geometry.coordinates[2];
        let color= depthToColor(depth);
        let earthquake= {
          magnitude: magnitude,
          depth: depth,
        }
        L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
          fillOpacity: 0.75,
          color: "black",
          weight: 0.5,
          fillColor: color,
          radius: size * 20000
        }).addTo(earthquakes);
        layer.bindPopup("Magnitude:" + earthquake.magnitude + "<br>Depth:" + earthquake.depth + "km");
    }
});
    createMap(earthquakes);
    
});
}
function createMap(earthquakes) {
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
   
    let baseMaps = {
      "Street Map": street
    };

    let overlayMaps = {
      Earthquakes: earthquakes
    };
    
    let myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [street, earthquakes]
    });
    baseMap.addTo(myMap);
    
    L.control.layers(baseMaps, overlayMaps, {
      collapse:false
    }).addTo(myMap);
    let legend= L.control({
      position:'bottomright',
    }).addTo(myMap);
    
    legend.onAdd= function(){
      let div = L.DomUtil.create("div", "info legend");
      let colors = ["red", "saddlebrown", "peachpuff", "mediumseagreen", "lightblue", "pink"];
      let labels = ["90+", "70-90", "50-70", "30-50", "10-30", "<10"];
      for (let i = 0; i < colors.length; i++) {
          div.innerHTML += "<i style='background: " + colors[i] + "'></i> " + labels[i] + "<br>";
      }
      return div;
    }
    legend.addTo(myMap)
  }
  function depthToColor(depth) {
    if (depth > 90) {
        return "red";
    } else if (depth > 70) {
        return "saddlebrown";
    } else if (depth > 50) {
        return "peachpuff";
    } else if (depth > 30) {
        return "mediumseagreen";
    } else if (depth > 10) {
        return "lightblue";
    } else {
        return "pink";
    }
  }
init();


