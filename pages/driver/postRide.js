document.addEventListener('DOMContentLoaded', function () {
    // Initialize the map once the page is loaded
    initMap();
});

function initMap() {
    // Set default map options
    const defaultLocation = { lat: 40.730610, lng: -73.935242 }; // Default location (New York as an example)

    // Create the map object
    const map = new google.maps.Map(document.getElementById("map"), {
        center: defaultLocation, // Set map center
        zoom: 12 // Set zoom level
    });

    // Add a marker at the default location
    const marker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        draggable: true, // Allow the marker to be dragged
        title: "Drag me to set pickup location"
    });

    // Event listener for when the marker is dragged
    marker.addListener('dragend', function (e) {
        const latLng = e.latLng;
        const lat = latLng.lat();
        const lng = latLng.lng();
        console.log("New location: Latitude: " + lat + ", Longitude: " + lng);
        // You can store the new coordinates or use them to post the ride
        document.getElementById('pickupLat').value = lat;
        document.getElementById('pickupLng').value = lng;
    });
}

// Function to handle form submission (when the driver posts a ride)
function postRide() {
    const pickupLat = document.getElementById('pickupLat').value;
    const pickupLng = document.getElementById('pickupLng').value;
    const destination = document.getElementById('destination').value;  // Get destination from form

    // Prepare the ride data to send to the backend
    const rideData = {
        pickupLat: pickupLat,
        pickupLng: pickupLng,
        destination: destination
    };

    // Send the data to the backend (Assuming your backend has an endpoint to post ride details)
    fetch('/api/postRide', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rideData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Ride posted successfully');
        } else {
            alert('Error posting ride');
        }
    })
    .catch(error => {
        console.error('Error posting ride:', error);
    });
}
