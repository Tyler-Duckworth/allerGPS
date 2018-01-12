        //Mapbox Init
            mapboxgl.accessToken = 'pk.eyJ1IjoidGhlLXF1YWNrIiwiYSI6ImNqYm1xaXdjMzFlNzgyeHFrMHBlMDMxazkifQ.agcY0DzyEadnFVm6qpSAFg';
            //Creates map object
                var map = new mapboxgl.Map({
                    container: 'map', // container id
                    style: 'mapbox://styles/mapbox/light-v9', //Link to map style
                    center: [-96, 37.8], // starting position
                    zoom: 3 // starting zoom
                });

            // Add geolocate control to the map, the little button you see in the top right hand corner of the map.
            
                map.addControl(new mapboxgl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true
                    },
                    trackUserLocation: true
                }));
            
            /*
                Set Bounds for Geocoder, basically the thing that lets us query via GET request features by address and returns JSON.
                Currently not in use, but can be used to easily procedurally generate restaurant data if given enough data.
                How it would work:
                    We would get the user's longitude and latitude from the Geolocate Control, 
                    and would use some math to create a bounding box for the Geocoder and the Map to prevent unnessecary plotting.
                    We would then use the geocoder and query each of the restaurants in allergps.json.
                    We would then parse the results into GeoJSON and automatically create points.
                Unfortunatley, we have run into too many roadblocks to accomplish this, but we hope to do it in the future.
            */
            
                var geocoder = new MapboxGeocoder({
                  accessToken: mapboxgl.accessToken,
                  bbox: [-84.241778, 35.787792, -83.538522, 36.225492]
                });
        
        //This function enables the zoom-in effect that we get when the user clicks on the point
        
            function flyToStore(currentFeature) {
              map.flyTo({
                center: currentFeature.geometry.coordinates,
                zoom: 15
              });
            }
        
        //This function creates the pop up that displays the restaurants name, address, and more.
        
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
            
        /*
            This function check to see if a layer exists before querying it for features.
            With this function, we are able to circumvent the many errors that appear if 
            we query a layer that does not exist. If the layer exists, it creates the popup
            and zoom effect.
        */
            
            function onClicks(g, lyrname) {
                if(map.getLayer(lyrname)) {
                    var features = map.queryRenderedFeatures(g.point, { layers: [lyrname]});
                    if (features.length) {
                        var clickedPoint = features[0];
                        // 1. Fly to the point
                        flyToStore(clickedPoint);
                        // 2. Close all other popups and display popup for clicked store
                        createPopUp(clickedPoint);
                
                    }
                }
            }
        
        /*
            This function allows us to create or toggle the layers when assigned the right variables.
            It first check to see if the button is active, and then checks to see if a layer exists.
            If the layer doesn't exist, it adds the layer.
        */
        
            function toggleLayers(clss, color, geojsn) {
                    if(!map.getLayer(clss)) {
                        console.log("Adding layer " + clss + " now..");
                        map.addLayer({
                            'id': clss,
                            'type': 'circle',
                            "source": {
                                "type": "geojson",
                                "data": geojsn
                            },
                            'paint': {
                                'circle-radius': 9,
                                'circle-color': '#fff'
                            }
                        });
                        map.addLayer({
                            'id': clss+'-halo',
                            'type': 'circle',
                            "source": {
                                "type": "geojson",
                                "data": geojsn
                            },
                            'paint': {
                                'circle-radius': 7,
                                'circle-color': color
                            }
                        });
                        $('#'+clss).addClass('active');
                    } else {
                        console.log(map.getLayoutProperty(clss, 'visibility'));
                        if(map.getLayoutProperty(clss, 'visibility') == "none") {
                            console.log("Changing visibility now");
                            map.setLayoutProperty(clss, 'visibility', 'visible');
                            map.setLayoutProperty(clss+"-halo", 'visibility', 'visible');
                        }
                        $('#'+clss).addClass('active');
                    }
            }
            
            /*
                This function hides all layers that are allergies. 
                This is based on the assumption that there are 151 layers in the map that are built in and should not be removed.
                It is used by the '#clear' button.
            */
            var lae;
            function clearLayer() {
                var layers = map.getStyle().layers.length - 151;
                console.log(map.getStyle().layers);
                if(layers > 0) {
                    for(var l = 1; l <= layers; l++) {
                        lae = JSON.stringify(map.getStyle().layers[150+l]);
                        if(!lae) {
                            console.log("Lae is undefined.");
                            console.log(l);
                        }
                        lae = lae.match('"id":"(.*)","type');
                        map.setLayoutProperty(lae[1], 'visibility', 'none')
                    }
                } else {
                    console.log("No allergy layers exist currently.");
                }
            }
        
        /*
            This commented-out section of the code gets the JSON from allergps.json, our main library of restaurants and grading system.
            It then parses the JSON. In the future this can be used to create the procedural code.
        
            $.getJSON('markers/allergps.json', function(data){
                var items = [];
                $.each(data, function(key, val1){
                    items.push([key, val1]);
                    val1 = [Object.keys(val1), Object.values(val1)];
                    //console.log(val1);
                });
                const whytho = [];
    
            });
        */
        
        /*
            This group of $().click() functions is where the magic happens. 
            Originally, these were in the $.getJSON(); function, but were moved out.  
        */
        
            $('#nuts').click(function() {
                toggleLayers("nuts", '#48f3ba', nutastic);
                console.log("Well nuts....");
            });
            
            $('#peanuts').click(function() {
                toggleLayers("peanuts", '#b082b2', peanuts);
            });
            
            $('#wheat').click(function() {
                toggleLayers("wheat", '#5a330d', wheat)
            });
            
            $('#seafood').click(function() {
                toggleLayers("seafood", '#4adc7b', seafood);
            });
            
            $('#dairy').click(function() {
                toggleLayers("dairy", '#0086b3', dairy);
            });
            $('#clear').click(function() {
                clearLayer();
            });
        
        // Add an event listener for when a user clicks on the map. It then calls the function that creates the popup and zoom-in effect.
        
            map.on('click', function(e) {
                onClicks(e, 'nuts');
                onClicks(e, 'dairy');
                onClicks(e, 'peanuts');
                onClicks(e, 'seafood');
                onClicks(e, 'wheat');
            });