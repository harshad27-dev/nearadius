import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const INITIAL_LAT = 12.9716;
const INITIAL_LNG = 77.5946;
const INITIAL_ZOOM = 14;

export default function MapScreen() {
    const insets = useSafeAreaInsets();
    const webViewRef = useRef<WebView>(null);
    const [radius, setRadius] = useState(1000); // meters
    const [status, setStatus] = useState("Safely inside the zone");
    const [mapReady, setMapReady] = useState(false);

    // Get live user location
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;

            const sub = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 3000,
                    distanceInterval: 5,
                },
                (loc) => {
                    const { latitude, longitude } = loc.coords;
                    updateMapLocation(latitude, longitude);
                }
            );

            return () => sub.remove();
        })();
    }, [mapReady]);

    const updateMapLocation = (lat: number, lng: number) => {
        if (!webViewRef.current) return;
        const script = `
            updateLocation(${lat}, ${lng}, ${radius});
            true;
        `;
        webViewRef.current.injectJavaScript(script);
    };

    return (
        <View style={styles.container}>
            <WebView
                ref={webViewRef}
                style={styles.map}
                originWhitelist={['*']}
                source={{ html: MAPLIBRE_HTML }}
                onMessage={(event) => {
                    const data = JSON.parse(event.nativeEvent.data);
                    if (data.type === 'GEOFENCE_STATUS') {
                        setStatus(data.message);
                    }
                }}
                onLoadEnd={() => setMapReady(true)}
            />

            {/* Top Overlay - HUD */}
            <View style={[styles.overlay, { top: insets.top + 12 }]}>
                <View style={[styles.statusDot, { backgroundColor: status.includes("Outside") ? "#ff4444" : "#00ffcc" }]} />
                <Text style={styles.overlayText}>
                    {status} ({radius}m)
                </Text>
            </View>

            {/* Bottom Overlay - Controls */}
            <View style={[styles.bottomOverlay, { bottom: insets.bottom + 20 }]}>
                <Text style={styles.statText}>Nearby Active: 142</Text>
                <Text style={styles.subStatText}>Heatmap Intensity: High</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    map: {
        flex: 1,
        backgroundColor: "#000",
    },
    overlay: {
        position: "absolute",
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(10,10,10,0.9)",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "#333",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
        shadowColor: "#00ffcc",
        shadowOpacity: 0.8,
        shadowRadius: 6,
    },
    overlayText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
        letterSpacing: 0.5,
    },
    bottomOverlay: {
        position: "absolute",
        left: 20,
        right: 20,
        backgroundColor: "rgba(10,10,10,0.85)",
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#222",
    },
    statText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 4,
    },
    subStatText: {
        color: "#888",
        fontSize: 12,
    },
});

const MAPLIBRE_HTML = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <script src="https://unpkg.com/maplibre-gl@4.0.0/dist/maplibre-gl.js"></script>
    <link href="https://unpkg.com/maplibre-gl@4.0.0/dist/maplibre-gl.css" rel="stylesheet" />
    <script src="https://unpkg.com/@turf/turf@6/turf.min.js"></script>
    <style>
        body { margin: 0; padding: 0; background-color: #000; }
        #map { width: 100vw; height: 100vh; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        const INITIAL_ZOOM = ${INITIAL_ZOOM};
        
        const map = new maplibregl.Map({
            container: 'map',
            style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
            center: [${INITIAL_LNG}, ${INITIAL_LAT}],
            zoom: INITIAL_ZOOM,
            attributionControl: false
        });

        // --- Data Generation (Simulation) ---
        function generateRandomPoints(center, count, radiusInKm) {
            const points = [];
            for (let i = 0; i < count; i++) {
                const r = radiusInKm * Math.sqrt(Math.random());
                const theta = Math.random() * 2 * Math.PI;
                const dx = r * Math.cos(theta); // km (approx)
                const dy = r * Math.sin(theta); // km (approx)
                
                // Simple conversion km to degrees (gross approximation but fine for visual)
                const dLat = dy / 110.574;
                const dLng = dx / (111.320 * Math.cos(center[1] * Math.PI / 180));

                points.push({
                    type: 'Feature',
                    properties: { intensity: Math.random() },
                    geometry: {
                        type: 'Point',
                        coordinates: [center[0] + dLng, center[1] + dLat]
                    }
                });
            }
            return { type: 'FeatureCollection', features: points };
        }

        let userLocation = [${INITIAL_LNG}, ${INITIAL_LAT}];
        
        map.on('load', () => {
            // Source: Users (Heatmap)
            const simulatedData = generateRandomPoints(userLocation, 150, 2); // 150 users within 2km
            map.addSource('users', {
                type: 'geojson',
                data: simulatedData
            });

            // Layer: Heatmap
            map.addLayer({
                id: 'user-heat',
                type: 'heatmap',
                source: 'users',
                maxzoom: 15,
                paint: {
                    // Increase the heatmap weight based on frequency and property magnitude
                    'heatmap-weight': [
                        'interpolate', ['linear'], ['get', 'intensity'],
                        0, 0,
                        1, 1
                    ],
                    // Increase the heatmap color weight weight by zoom level
                    // heatmap-intensity is a multiplier on top of heatmap-weight
                    'heatmap-intensity': [
                        'interpolate', ['linear'], ['zoom'],
                        0, 1,
                        15, 3
                    ],
                    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                    // Begin color ramp at 0-stop with a 0-transparancy color
                    // to create a blur-like effect.
                    'heatmap-color': [
                        'interpolate', ['linear'], ['heatmap-density'],
                        0, 'rgba(33,102,172,0)',
                        0.2, 'rgb(103,169,207)',
                        0.4, 'rgb(209,229,240)',
                        0.6, 'rgb(253,219,199)',
                        0.8, 'rgb(239,138,98)',
                        1, 'rgb(178,24,43)'
                    ],
                    // Adjust the heatmap radius by zoom level
                    'heatmap-radius': [
                        'interpolate', ['linear'], ['zoom'],
                        0, 2,
                        9, 20
                    ],
                    // Transition from heatmap to circle layer by zoom level
                    'heatmap-opacity': [
                        'interpolate', ['linear'], ['zoom'],
                        14, 1,
                        15, 0
                    ],
                }
            });

            // Source: User Location & Radius
            map.addSource('me', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [] 
                }
            });

            // Layer: Radius Fill
            map.addLayer({
                id: 'radius-fill',
                type: 'fill',
                source: 'me',
                filter: ['==', '$type', 'Polygon'],
                paint: {
                    'fill-color': '#00ffcc',
                    'fill-opacity': 0.1
                }
            });

            // Layer: Radius Outline
            map.addLayer({
                id: 'radius-line',
                type: 'line',
                source: 'me',
                filter: ['==', '$type', 'Polygon'],
                paint: {
                    'line-color': '#00ffcc',
                    'line-width': 2,
                    'line-dasharray': [2, 2]
                }
            });

            // Layer: My Dot
            map.addLayer({
                id: 'my-dot',
                type: 'circle',
                source: 'me',
                filter: ['==', '$type', 'Point'],
                paint: {
                    'circle-radius': 8,
                    'circle-color': '#00ffcc',
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff',
                    'circle-pitch-alignment': 'map'
                }
            });

            // Add Pulsing Effect CSS (simulated via repeated setPaintProperty or just static for now)
            
            // Initial render
            updateLocation(userLocation[1], userLocation[0], 1000);
        });

        function updateLocation(lat, lng, radius) {
            userLocation = [lng, lat];
            
            // Create Radius Circle GeoJSON (using Turf.js would be ideal here if imported, otherwise manual approx)
            // Since we imported Turf in head, let's use it.
            var center = turf.point([lng, lat]);
            var options = {steps: 64, units: 'meters'};
            var circle = turf.circle([lng, lat], radius, options);
            
            var point = {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [lng, lat]
                }
            };

            if (map.getSource('me')) {
                map.getSource('me').setData({
                    type: 'FeatureCollection',
                    features: [circle, point]
                });
            }

            // Geofencing Check
            // We can check if "Me" is inside a target zone. 
            // For now let's just reverse it: Is the center of the "City" inside my radius? 
            // Or typically: Am I inside a restricted zone?
            
            // Let's implement a simple logic:
            // "Zone" is defined at INITIAL location with 500m radius.
            // If I am further than 500m from INITIAL, I am "Outside".
            
            const from = turf.point([${INITIAL_LNG}, ${INITIAL_LAT}]);
            const to = turf.point([lng, lat]);
            const distance = turf.distance(from, to, {units: 'meters'});
            
            let statusComp = "Safely inside the zone";
            if (distance > 500) {
                statusComp = "Outside Safe Zone!";
            }
            
            // Send back to RN
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'GEOFENCE_STATUS',
                message: statusComp
            }));

            // map.easeTo({ center: userLocation });
        }
    </script>
</body>
</html>
`;


