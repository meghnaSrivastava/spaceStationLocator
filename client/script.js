// Grab all elements needed
let latitudeText = document.querySelector('.latitude');
let longitudeText = document.querySelector('.longitude');
let timeText = document.querySelector('.time');
let speedText = document.querySelector('.speed');
let altitudeText = document.querySelector('.altitude');
let visibilityText = document.querySelector('.visibility');

/* Default latitude and longitude. Here lat and long is for "India" */
let lat = 78.9629;
let long = 20.5937;
let zoomLevel = 5;

// Set space station image as Marker
const icon = L.icon({
    iconUrl: './assets/image/satellite.svg',
    iconSize: [90, 45],
    iconAnchor: [25, 94],
    popupAnchor: [20, -86]
});

// Drawing map interface on #map-div
const map = L.map('map-div').setView([lat, long], zoomLevel);

// Add map tiles from Mapbox's Static Tiles API
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYWsyOCIsImEiOiJjazl6YTJrZ2gwN2Z6M21wYWhqbHV1dXFhIn0.2s7LanKmroqsWPY2q2pQfQ'
}).addTo(map);

// Adding the Marker icon to map
const marker = L.marker([lat, long], { icon: icon }).addTo(map);

// findISS() function definition
function findISS() {
    fetch("https://api.wheretheiss.at/v1/satellites/25544")
        .then(response => response.json())
        .then(data => {
            lat = data.latitude.toFixed(2);
            long = data.longitude.toFixed(2);
            // Converting seconds to milliseconds, then to UTC format
            const timestamp = new Date(data.timestamp * 1000).toUTCString();
            const speed = data.velocity.toFixed(2);
            const altitude = data.altitude.toFixed(2);
            const visibility = data.visibility;

            // Calling updateISS() function to update localtion attributes of space station
            updateISS(lat, long, timestamp, speed, altitude, visibility);
        })
        .catch(error => console.log(error));
}

// updateISS() function definition
function updateISS(lat, long, timestamp, speed, altitude, visibility) {
    // Updates Marker's lat and long on map
    marker.setLatLng([lat, long]);
    // Updates map view according to Marker's new position
    map.setView([lat, long]);
    // Updates other element's value
    latitudeText.innerText = lat;
    longitudeText.innerText = long;
    timeText.innerText = timestamp;
    speedText.innerText = `${speed} km/hr`;
    altitudeText.innerText = `${altitude} km`;
    visibilityText.innerText = visibility;
}

/* Calling findISS() initially to immediately set the ISS location */
findISS();

// Calling findISS() for every 2 seconds
setInterval(findISS, 2000);