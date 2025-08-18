const my_loc = document.getElementById("user_location");
const mapDiv = document.getElementById("map");

const Lahore_btn = document.getElementById("lahore");
const Karachi_btn = document.getElementById("kar");
const Islamabad_btn = document.getElementById("isl");
const Okara_btn = document.getElementById("okara");

const list = document.getElementById("list");

let userMarker;
let userLocation;
let routeControl;
let markerCluster;
let backToUserBtn;


const userIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3177/3177361.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});


const cityIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35]
});


const cityKeypoints = [
  {
    city: "Lahore",
    points: [
      { name: "Badshahi Mosque", lat: 31.5886, lng: 74.3100 },
      { name: "Lahore Fort", lat: 31.5900, lng: 74.3111 },
      { name: "Shalimar Gardens", lat: 31.5880, lng: 74.3986 },
      { name: "Minar-e-Pakistan", lat: 31.5925, lng: 74.3096 }
    ]
  },
  {
    city: "Karachi",
    points: [
      { name: "Quaid-e-Azam Mausoleum", lat: 24.8746, lng: 67.0398 },
      { name: "Clifton Beach", lat: 24.8042, lng: 67.0220 },
      { name: "Pakistan Maritime Museum", lat: 24.9131, lng: 67.0922 },
      { name: "Frere Hall", lat: 24.8486, lng: 67.0330 }
    ]
  },
  {
    city: "Islamabad",
    points: [
      { name: "Faisal Mosque", lat: 33.7295, lng: 73.0370 },
      { name: "Pakistan Monument", lat: 33.6938, lng: 73.0689 },
      { name: "Rawal Lake", lat: 33.6939, lng: 73.1269 },
      { name: "Lok Virsa Museum", lat: 33.6935, lng: 73.0551 }
    ]
  },
  {
    city: "Okara",
    points: [
      { name: "Okara Cantt", lat: 30.8000, lng: 73.4500 },
      { name: "Okara Gymkhana", lat: 30.8200, lng: 73.5000 },
      { name: "Okara Railway Station", lat: 30.8100, lng: 73.4590 }
    ]
  }
];


const baseLayers = {
  "🌍 OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }),

  "🛰️ Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri &mdash; Source: Esri, NASA, USGS'
  }),

  "🗺️ Topographic": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenTopoMap contributors'
  }),

  "🌑 Dark Mode": L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CartoDB'
  }),

  "☀️ Light Mode": L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CartoDB'
  })
};


let mapInstance = L.map("map", {
  layers: [baseLayers["🌍 OpenStreetMap"]]
});


L.control.layers(baseLayers, null, { position: "topright" }).addTo(mapInstance);


function clearRoute() {
  if (routeControl) {
    mapInstance.removeControl(routeControl);
    routeControl = null;
  }
}


function showRouteToCity(cityCoords, cityName) {
  clearRoute();

  routeControl = L.Routing.control({
    waypoints: [
      L.latLng(userLocation[0], userLocation[1]),
      L.latLng(cityCoords.lat, cityCoords.lng)
    ],
    routeWhileDragging: false,
    addWaypoints: false,
    draggableWaypoints: false,
    showAlternatives: true,
    lineOptions: {
      styles: [{ color: '#ff6600', weight: 5, opacity: 0.8 }]
    },
    createMarker: function (i, waypoint) {
      if (i === 0) {
        const userCard = `
          <div style="display:flex;align-items:center;gap:10px;">
              <img src="https://raw.githubusercontent.com/MuaazAliC/Internship-Projects/refs/heads/main/6th/img/pf.png" 
                   alt="User" style="width:50px;height:50px;border-radius:50%;border:2px solid #ff6600;">
              <div>
                  <strong>You</strong><br>
                  <span>📍 Current Location</span><br>
                  <span>Name: Muhammad Muaaz Ali</span><br>
                  <span>Email: muaazaliwork@gmail.com</span>
              </div>
          </div>
        `;
        return L.marker(waypoint.latLng, { icon: userIcon }).bindPopup(userCard).openPopup();
      } else {
        return L.marker(waypoint.latLng, { icon: cityIcon })
          .bindPopup(`📌 ${cityName}`);
      }
    }
  }).addTo(mapInstance);

  routeControl.on("routesfound", function (e) {
    const route = e.routes[0];
    if (route && route.coordinates) {
      const bounds = L.latLngBounds(route.coordinates);
      mapInstance.flyToBounds(bounds, { padding: [100, 100], duration: 1.5 });
    }
  });
}


function showCityKeypoints(cityName) {
  if (markerCluster) {
    mapInstance.removeLayer(markerCluster);
  }
  markerCluster = L.markerClusterGroup();

  const city = cityKeypoints.find(c => c.city === cityName);
  if (city) {
    city.points.forEach(p => {
      const marker = L.marker([p.lat, p.lng], { icon: cityIcon })
        .bindPopup(`<strong>${p.name}</strong><br>📍 ${city.city}`);
      markerCluster.addLayer(marker);
    });
    mapInstance.addLayer(markerCluster);
  }
}


function showAllCityKeypoints() {
  if (markerCluster) {
    mapInstance.removeLayer(markerCluster);
  }
  markerCluster = L.markerClusterGroup();

  cityKeypoints.forEach(city => {
    city.points.forEach(p => {
      const marker = L.marker([p.lat, p.lng], { icon: cityIcon })
        .bindPopup(`<strong>${p.name}</strong><br>📍 ${city.city}`);
      markerCluster.addLayer(marker);
    });
  });

  mapInstance.addLayer(markerCluster);
}


showAllCityKeypoints();


my_loc.addEventListener("click", () => {
  const isMapVisible = mapDiv.style.display === "block";
  mapDiv.style.display = isMapVisible ? "none" : "block";
  my_loc.innerHTML = !isMapVisible ? "Hide Map" : "My Location";
  list.style.display = isMapVisible ? "none" : "flex";

  if (!isMapVisible) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      userLocation = [lat, lon];

      mapInstance.setView(userLocation, 14);

      if (!userMarker) {
        const userCard = `
          <div style="display:flex;align-items:center;gap:10px;">
              <img src="https://raw.githubusercontent.com/MuaazAliC/Internship-Projects/refs/heads/main/6th/img/pf.png" 
                   alt="User" style="width:50px;height:50px;border-radius:50%;border:2px solid #f70606ff;">
              <div>
                  <strong>You</strong><br>
                  <span>📍 Current Location</span><br>
                  <span>Name: Muhammad Muaaz Ali</span><br>
                  <span>Email: muaazaliwork@gmail.com</span>
              </div>
          </div>
        `;
        userMarker = L.marker(userLocation, { icon: userIcon }).addTo(mapInstance)
          .bindPopup(userCard).openPopup();
      } else {
        userMarker.setLatLng(userLocation);
        userMarker.openPopup();
      }

      setTimeout(() => mapInstance.invalidateSize(), 200);

      if (!backToUserBtn) {
        backToUserBtn = L.control({ position: "bottomright" });
        backToUserBtn.onAdd = () => {
          const btn = L.DomUtil.create("button", "back-to-user");
          btn.innerHTML = "📍 Back to Me";
          btn.style.background = "#333";
          btn.style.color = "#fff";
          btn.style.padding = "8px 12px";
          btn.style.borderRadius = "5px";
          btn.style.cursor = "pointer";
          btn.onclick = () => {
            if (userLocation) mapInstance.setView(userLocation, 14);
          };
          return btn;
        };
        backToUserBtn.addTo(mapInstance);
      }
    }, (error) => {
      alert("Unable to retrieve location");
      console.error(error);
    });
  }
});


const Lahore = { lat: 31.5497, lng: 74.3436 };
const Karachi = { lat: 24.8607, lng: 67.0011 };
const Islamabad = { lat: 33.6844, lng: 73.0479 };
const Okara = { lat: 30.8104, lng: 73.6840 };


Lahore_btn.addEventListener("click", () => {
  showRouteToCity(Lahore, "Lahore");
  
});
Karachi_btn.addEventListener("click", () => {
  showRouteToCity(Karachi, "Karachi");

});
Islamabad_btn.addEventListener("click", () => {
  showRouteToCity(Islamabad, "Islamabad");
  
});
Okara_btn.addEventListener("click", () => {
  showRouteToCity(Okara, "Okara");
  
});
