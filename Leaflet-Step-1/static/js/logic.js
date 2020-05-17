function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
        "Light Map": lightmap
    };

    // Create an overlayMaps object to hold the earthquakes layer
    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    // Create the map object with options
    var map = L.map("map", {
        center: [15.5994, -28.6731],
        zoom: 3,
        layers: [lightmap, earthquakes]
    });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);
}

function createMarkers(response) {

    // Pull the locations property off of response.data
    var locations = response.features;
    // Initialize an array to hold quake markers
    var quakeMarkers = [];

    // Loop through the locations array
    for (var index = 0; index < locations.length; index++) {
        var earthquake = locations[index];
        var y = earthquake.geometry.coordinates[0]
        var x = earthquake.geometry.coordinates[1]
        var color = "";

        if (earthquake.properties.mag > 7) {
            color = "red";
        } else if (earthquake.properties.mag > 6) {
            color = "orange";
        } else if (earthquake.properties.mag > 5) {
            color = "yellow";
        } else if (earthquake.properties.mag > 4.5) {
            color = "green";
        } else {
            color = "blue";
        }

        // For each earthquake, create a marker and bind a popup with the earthquake's name
        var quakeMarker = L.circleMarker([x, y], {
                fillOpacity: 0.75,
                color: "white",
                fillColor: color,
                radius: earthquake.properties.mag + 1
            })
            .bindPopup("<h3>" + earthquake.properties.place + "</h3>");

        // Add the marker to the quakeMarkers array
        quakeMarkers.push(quakeMarker);
    }

    // Create a layer group made from the quake markers array, pass it into the createMap function
    createMap(L.layerGroup(quakeMarkers));
}

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson", createMarkers);


// // Legend help taken from https://codepen.io/haakseth/pen/KQbjdO 
// var legend = L.control({ position: "bottomleft" });

// legend.onAdd = function(map) {
//     var div = L.DomUtil.create("div", "legend");
//     div.innerHTML += "<h4>Tegnforklaring</h4>";
//     div.innerHTML += '<i style="background: #477AC2"></i><span>Water</span><br>';
//     div.innerHTML += '<i style="background: #448D40"></i><span>Forest</span><br>';
//     div.innerHTML += '<i style="background: #E6E696"></i><span>Land</span><br>';
//     div.innerHTML += '<i style="background: #E8E6E0"></i><span>Residential</span><br>';
//     div.innerHTML += '<i style="background: #FFFFFF"></i><span>Ice</span><br>';
//     div.innerHTML += '<i class="icon" style="background-image: url(https://d30y9cdsu7xlg0.cloudfront.net/png/194515-200.png);background-repeat: no-repeat;"></i><span>Grænse</span><br>';



//     return div;
// };

// legend.addTo(map);