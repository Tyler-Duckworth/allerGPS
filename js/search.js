        //Mapbox Init
        mapboxgl.accessToken = 'pk.eyJ1IjoidGhlLXF1YWNrIiwiYSI6ImNqYm1xaXdjMzFlNzgyeHFrMHBlMDMxazkifQ.agcY0DzyEadnFVm6qpSAFg';
        var map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/light-v9',
            center: [-96, 37.8], // starting position
            zoom: 3 // starting zoom
        });
        
        // Add geolocate control to the map.
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        }));
        var lat, lng;
        var isLocator;
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
            	var locationMarker = null;
            	if (locationMarker){
            	  // return if there is a locationMarker bug
            	  return;
            	}
            
            	// sets default position to your position
            	lat = position.coords["latitude"];
            	lng = position.coords["longitude"];
                isLocator = true;
                endURL = lat + "%2C%20" + lng + "&bbox=-84.241778%2C%2035.787792%2C%20-83.538522%2C%2036.225492&language=en";
            	},
            	function(error) {
            	console.log("Error: ", error);
            	},
            	{
            	enableHighAccuracy: true
            	}
            );
        }
        var baseURL = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
        var midURL = ".json?access_token=pk.eyJ1IjoidGhlLXF1YWNrIiwiYSI6ImNqYm1xaXdjMzFlNzgyeHFrMHBlMDMxazkifQ.agcY0DzyEadnFVm6qpSAFg&country=us&proximity=";
        function moveCarmenToProperties(fc) {
          // clone as not to mutate this everywhere.
          return {
            type: 'FeatureCollection',
            features: $.map(JSON.parse(JSON.stringify(fc.features)), function (feature) {
              ['id', 'text', 'place_name', 'bbox', 'address', 'center', 'context'].forEach(function (prop) {
                feature.properties[prop] = feature[prop];
              });
              feature.properties.encoded = true;
              return feature;
            })
          };
        }
        function flyToStore(currentFeature) {
          map.flyTo({
            center: currentFeature.geometry.coordinates,
            zoom: 15
          });
        }
        function round(value, decimals) {
            return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
        }
        function createPopUp(currentFeature) {
          var popUps = document.getElementsByClassName('mapboxgl-popup');
          // Check if there is already a popup on the map and if so, remove it
          if (popUps[0]) popUps[0].remove();
        
          var popup = new mapboxgl.Popup({ closeOnClick: false })
            .setLngLat(currentFeature.geometry.coordinates)
            .setHTML('<p>' + currentFeature.properties.title + '</p>' +
              '<p>' + currentFeature.properties.address + '</p>')
            .addTo(map);
        }
        function toggleLayers() {
           var length = map.getStyle().layers.length - 150;
           if(length > 0) {
               for(var g = 1; g <= length; g++) {
                   var idlay = JSON.stringify(map.getStyle().layers[150]);
                    console.log(g);

               }
           } else {
               console.log("No other layers exist");
           }
           console.log(map.getStyle().layers);
        }
        var names = [];
        var endURL = "&bbox=-84.241778%2C%2035.787792%2C%20-83.538522%2C%2036.225492&language=en";

        $.getJSON('markers/allergps.json', function(data){
            console.log("Juke!");
            var items = [];
            $.each(data, function(key, val1){
                items.push([key, val1]);
                val1 = [Object.keys(val1), Object.values(val1)];
                //console.log(val1);
            });
            console.log(items);
            const whytho = [];
            $('#nuts').click(function() {
                toggleLayers();
                console.log("Well nuts....");
                for(var j in items) {
                    if(items[j][1].Nuts > 0.25) {
                        names.push(reName);
                        var reName = items[j][0].toString();
                        reName.replace(' ', '%20');
                        reName.replace('&', '%26');
                        var URL = baseURL + reName + midURL + endURL;
                        //console.log(URL);
                        $.ajax({
                            url: URL,
                            method: 'GET',
                            dataType: 'json',
                            success: function(data) {
                                
                                whytho.push(data);
                            }
                        });
                        //console.log(items[j][0]);
                    }
                }
                console.log(names);
                map.addLayer({
                    'id': 'nuts',
                    'type': 'circle',
                    "source": {
                        "type": "geojson",
                        "data": nutastic
                    },
                    'paint': {
                        'circle-radius': 9,
                        'circle-color': '#fff'
                    }
                });
                map.addLayer({
                    'id': 'nuts-halo',
                    'type': 'circle',
                    "source": {
                        "type": "geojson",
                        "data": nutastic
                    },
                    'paint': {
                        'circle-radius': 7,
                        'circle-color': '#48f3ba'
                    }
                });
            });
            $('#peanuts').click(function() {
                toggleLayers();
                for(var j in items) {
                    if(items[j][1].Peanuts > 0.25) {
                        names.push(reName);
                        var reName = items[j][0].toString();
                        reName.replace(' ', '%20');
                        var URL = baseURL + reName + midURL + endURL;
                        //console.log(URL);
                        $.ajax({
                            url: URL,
                            method: 'GET',
                            dataType: 'json',
                            success: function(data) {
                                
                                whytho.push(data);
                            }
                        });
                        //console.log(items[j][0]);
                    }
                }
                console.log(names);
                map.addLayer({
                    'id': 'peanuts',
                    'type': 'circle',
                    "source": {
                        "type": "geojson",
                        "data": peanuts
                    },
                    'paint': {
                        'circle-radius': 9,
                        'circle-color': '#fff'
                    }
                });
                map.addLayer({
                    'id': 'peanuts-halo',
                    'type': 'circle',
                    "source": {
                        "type": "geojson",
                        "data": peanuts
                    },
                    'paint': {
                        'circle-radius': 7,
                        'circle-color': '#b082b2'
                    }
                });
            });
            $('#wheat').click(function() {
                toggleLayers();
                for(var j in items) {
                    if(items[j][1].Wheat > 0.25) {
                        names.push(reName);
                        var reName = items[j][0].toString();
                        reName.replace(' ', '%20');
                        var URL = baseURL + reName + midURL + endURL;
                        //console.log(URL);
                        $.ajax({
                            url: URL,
                            method: 'GET',
                            dataType: 'json',
                            success: function(data) {
                                whytho.push(data);
                            }
                        });
                        //console.log(items[j][0]);
                    }
                }
                console.log(names);
                map.addLayer({
                    'id': 'wheat',
                    'type': 'circle',
                    "source": {
                        "type": "geojson",
                        "data": wheat
                    },
                    'paint': {
                        'circle-radius': 9,
                        'circle-color': '#fff'
                    }
                });
                map.addLayer({
                    'id': 'wheat-halo',
                    'type': 'circle',
                    "source": {
                        "type": "geojson",
                        "data": wheat
                    },
                    'paint': {
                        'circle-radius': 7,
                        'circle-color': '#5a330d'
                    }
                });
            });
            $('#seafood').click(function() {
                toggleLayers();
                for(var j in items) {
                    if(items[j][1].Seafood > 0.25) {
                        names.push(reName);
                        var reName = items[j][0].toString();
                        reName.replace(' ', '%20');
                        var URL = baseURL + reName + midURL + endURL;
                        //console.log(URL);
                        $.ajax({
                            url: URL,
                            method: 'GET',
                            dataType: 'json',
                            success: function(data) {
                                whytho.push(data);
                            }
                        });
                        //console.log(items[j][0]);
                    }
                }
                console.log(names);
                map.addLayer({
                    'id': 'seafood',
                    'type': 'circle',
                    "source": {
                        "type": "geojson",
                        "data": seafood
                    },
                    'paint': {
                        'circle-radius': 9,
                        'circle-color': '#fff'
                    }
                });
                map.addLayer({
                    'id': 'seafood-halo',
                    'type': 'circle',
                    "source": {
                        "type": "geojson",
                        "data": seafood
                    },
                    'paint': {
                        'circle-radius': 7,
                        'circle-color': '#4adc7b'
                    }
                });
            });
            $('#dairy').click(function() {
                toggleLayers();
                for(var j in items) {
                    if(items[j][1].Dairy > 0.25) {
                        names.push(reName);
                        var reName = items[j][0].toString();
                        reName.replace(' ', '%20');
                        var URL = baseURL + reName + midURL + endURL;
                        //console.log(URL);
                        $.ajax({
                            url: URL,
                            method: 'GET',
                            dataType: 'json',
                            success: function(data) {
                                whytho.push(data);
                            }
                        });
                        //console.log(items[j][0]);
                    }
                }
                console.log(names);
                map.addLayer({
                    'id': 'dairy',
                    'type': 'circle',
                    "source": {
                        "type": "geojson",
                        "data": dairy
                    },
                    'paint': {
                        'circle-radius': 9,
                        'circle-color': '#fff'
                    }
                });
                map.addLayer({
                    'id': 'dairy-halo',
                    'type': 'circle',
                    "source": {
                        "type": "geojson",
                        "data": dairy
                    },
                    'paint': {
                        'circle-radius': 7,
                        'circle-color': '#0086b3'
                    }
                });

            });
        });
        // Add an event listener for when a user clicks on the map
        map.on('click', function(e) {
            var stringthings = e.lngLat;
            var lnger = round(stringthings.lng, 3);
            var latter = round(stringthings.lat, 3);
            // Query all the rendered points in the view
            var features = map.queryRenderedFeatures(e.point, { layers: ['nuts']});
            if (features.length) {
                var clickedPoint = features[0];
                // 1. Fly to the point
                flyToStore(clickedPoint);
                // 2. Close all other popups and display popup for clicked store
                createPopUp(clickedPoint);
        
            }
            var dai = map.queryRenderedFeatures(e.point, { layers: ['dairy']});
            if (dai.length) {
                var declickedPoint = dai[0];
                // 1. Fly to the point
                flyToStore(declickedPoint);
                // 2. Close all other popups and display popup for clicked store
                createPopUp(declickedPoint);
        
            }
            var pea = map.queryRenderedFeatures(e.point, { layers: ['peanuts']});
            if (pea.length) {
                var peclickedPoint = pea[0];
                // 1. Fly to the point
                flyToStore(peclickedPoint);
                // 2. Close all other popups and display popup for clicked store
                createPopUp(peclickedPoint);
        
            }
            var seaf = map.queryRenderedFeatures(e.point, { layers: ['seafood']});
            if (seaf.length) {
                var seclickedPoint = seaf[0];
                // 1. Fly to the point
                flyToStore(seclickedPoint);
                // 2. Close all other popups and display popup for clicked store
                createPopUp(seclickedPoint);
        
            }
            var whe = map.queryRenderedFeatures(e.point, { layers: ['wheat']});
            if (whe.length) {
                var wheclickedPoint = whe[0];
                // 1. Fly to the point
                flyToStore(wheclickedPoint);
                // 2. Close all other popups and display popup for clicked store
                createPopUp(wheclickedPoint);
        
            }
        });
        //Set Bounds for Geocoder
        var geocoder = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          bbox: [-84.241778, 35.787792, -83.538522, 36.225492]
        });