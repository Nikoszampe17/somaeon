// === SOMAEON MAP WITH RADIUS + ADDRESS CHECK ===
let map, radiusCircle;
const centerPoint = { lat: 37.9755, lng: 23.7348 }; // Syntagma Square
const freeRadius = 4000; // 4km free zone

// === API REQUEST GUARD ===
let lastApiCall = 0;
const API_COOLDOWN = 5000; // 5 seconds

function canMakeApiCall() {
  const now = Date.now();
  if (now - lastApiCall < API_COOLDOWN) {
    return false;
  }
  lastApiCall = now;
  return true;
}

function initMap() {
  map = new google.maps.Map(document.getElementById("somaeon-map"), {
    center: centerPoint,
    zoom: 13,
    styles: [
      { featureType: "all", elementType: "labels", stylers: [{ visibility: "off" }] },
      { featureType: "road", elementType: "geometry", stylers: [{ color: "#e4d8c3" }] },
      { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f9f5f0" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#d8e6f3" }] }
    ]
  });

  // Draw free zone circle
  radiusCircle = new google.maps.Circle({
    map,
    center: centerPoint,
    radius: freeRadius,
    strokeColor: "#bda585",
    strokeWeight: 2,
    fillColor: "#bda585",
    fillOpacity: 0.20
  });
}

// === Address Checker ===

// Reset result when typing
document.getElementById("address-input").addEventListener("input", () => {
  const areaBox = document.getElementById("area-result");
  areaBox.style.display = "none";
});

document.getElementById("check-area-btn").addEventListener("click", () => {
  const address = document.getElementById("address-input").value.trim();
  const output = document.getElementById("area-result");
  const button = document.getElementById("check-area-btn");

  output.style.display = "none";

  // === RATE LIMIT ===
  if (!canMakeApiCall()) {
    output.style.display = "block";
    output.textContent = "Please wait a few seconds before checking again.";
    return;
  }

  if (!address) {
    output.style.display = "block";
    output.textContent = "Please enter an address.";
    return;
  }

  // Disable button to prevent spam
  button.disabled = true;

  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address }, (results, status) => {

    if (status !== "OK") {
      output.style.display = "block";
      output.textContent = "Address not found. Please try again.";
      button.disabled = false;
      return;
    }

    const destination = results[0].geometry.location;

    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [centerPoint],
        destinations: [destination],
        travelMode: "DRIVING",
        unitSystem: google.maps.UnitSystem.METRIC
      },
      (response, status) => {

        if (status !== "OK") {
          output.style.display = "block";
          output.textContent = "Distance calculation failed.";
          button.disabled = false;
          return;
        }

        const element = response.rows[0].elements[0];

        if (element.status !== "OK") {
          output.style.display = "block";
          output.textContent = "Route not found.";
          button.disabled = false;
          return;
        }

        const distanceMeters = element.distance.value;
        const distanceKm = distanceMeters / 1000;
        const freeRadiusKm = freeRadius / 1000;

        output.style.display = "block";

        if (distanceKm <= freeRadiusKm) {
          output.textContent =
            "Your area is inside our complimentary service zone.";
        } else {
          const extraKm = (distanceKm - freeRadiusKm).toFixed(2);
          const feePerKm = 2.50;
          const fee = (extraKm * feePerKm).toFixed(2);

          output.textContent =
            `Your area is ${extraKm} km outside the free zone.\n` +
            `Estimated travel fee: €${fee}.`;
        }

        // Re-enable button after response
        setTimeout(() => {
          button.disabled = false;
        }, 2000);
      }
    );

  });

});
