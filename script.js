const my_loc = document.getElementById("user_location");
const mapDiv = document.getElementById("map");

const Lahore = { lat: 31.5497, lng: 74.3436 };
const Karachi = { lat: 24.8607, lng: 67.0011 };
const Islamabad = { lat: 33.6844, lng: 73.0479 };
const Okara = { lat: 30.8104, lng: 73.6840 };

const Lahore_btn = document.getElementById("lahore");
const Karachi_btn = document.getElementById("kar");
const Islamabad_btn = document.getElementById("isl");
const Okara_btn = document.getElementById("okara");

const list = document.getElementById("list");

let mapInstance;
let userMarker;
let userLocation;
let routeControl;


function clearRoute() {
    if (routeControl) {
        mapInstance.removeControl(routeControl);
        routeControl = null;
    }
}

function showRouteToCity(cityCoords, cityName) {
    if (!userLocation) {
        alert("Please enable location and open the map first.");
        return;
    }

    clearRoute();

    routeControl = L.Routing.control({
        waypoints: [
            L.latLng(userLocation[0], userLocation[1]),
            L.latLng(cityCoords.lat, cityCoords.lng)
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        showAlternatives: false,
        lineOptions: {
            styles: [{ color: '#ff6600', weight: 5, opacity: 0.8 }]
        },
        createMarker: function (i, waypoint) {
            return L.marker(waypoint.latLng).bindPopup(
                i === 0 ? "📍 You are here" : `📌 ${cityName}`
            );
        }
    }).addTo(mapInstance);
}


my_loc.addEventListener("click", () => {
    const isMapVisible = mapDiv.style.display === "block";
    list.style.display = isMapVisible ? "none" : "flex";
    mapDiv.style.display = isMapVisible ? "none" : "block";
    my_loc.innerHTML = !isMapVisible ? "Hide Map" : "My Location";

    if (!isMapVisible) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            userLocation = [lat, lon];

            if (!mapInstance) {
                mapInstance = L.map('map').setView(userLocation, 6);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors'
                }).addTo(mapInstance);
                userMarker = L.marker(userLocation).addTo(mapInstance)
                    .bindPopup("📍 You are here!").openPopup();
            } else {
                mapInstance.setView(userLocation, 6);
                userMarker.setLatLng(userLocation);
            }
        }, (error) => {
            alert("Unable to retrieve location");
            console.error(error);
        });
    } else {
        clearRoute();
    }
});


Lahore_btn.addEventListener("click", () => showRouteToCity(Lahore, "Lahore"));
Karachi_btn.addEventListener("click", () => showRouteToCity(Karachi, "Karachi"));
Islamabad_btn.addEventListener("click", () => showRouteToCity(Islamabad, "Islamabad"));
Okara_btn.addEventListener("click", () => showRouteToCity(Okara, "Okara"));
