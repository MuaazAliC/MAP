const my_loc = document.getElementById("user_location");
const mapDiv = document.getElementById("map");

let mapInstance; 
let marker; 

my_loc.addEventListener("click", () => {
  
    mapDiv.style.display = mapDiv.style.display === "block" ? "none" : "block";
    my_loc.innerHTML = mapDiv.style.display === "block" ? "Hide Map" : "My Location";

    if (mapDiv.style.display === "block") {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            console.log(`Latitude: ${lat}, Longitude: ${lon}`);

           
            if (!mapInstance) {
                mapInstance = L.map('map').setView([lat, lon], 15);

               
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors'
                }).addTo(mapInstance);

               
                marker = L.marker([lat, lon]).addTo(mapInstance)
                    .bindPopup("You are here!").openPopup();
            } else {
               
                mapInstance.setView([lat, lon], 15);
                marker.setLatLng([lat, lon]);
            }
        }, (error) => {
            alert("Unable to retrieve location");
            console.error(error);
        });
    }
});