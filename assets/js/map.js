// === SOMAEON MAP WITH RADIUS + ADDRESS CHECK ===
let map, radiusCircle;
const centerPoint = { lat: 37.9755, lng: 23.7348 }; // Syntagma Square
const freeRadius = 4000; // 4km free zone

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
document.getElementById("check-area-btn").addEventListener("click", () => {
  const address = document.getElementById("address-input").value.trim();
  const output = document.getElementById("area-result");

  if (!address) {
    output.textContent = "Please enter an address.";
    return;
  }

  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address }, (results, status) => {
    if (status !== "OK") {
      output.textContent = "Address not found. Please try again.";
      return;
    }

    const resultLocation = results[0].geometry.location;
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      resultLocation,
      new google.maps.LatLng(centerPoint.lat, centerPoint.lng)
    );

    if (distance <= freeRadius) {
      output.textContent = "Your area is inside our complimentary service zone.";
    } else {
      // €1.25 per km each way → €2.50 per km total charge
const feePerKm = 2.50;

const extraKm = ((distance - freeRadius) / 1000).toFixed(2);
const fee = (extraKm * feePerKm).toFixed(2);

output.textContent = `
Your area is ${extraKm} km outside the free zone.
Estimated travel fee: €${fee}.
`;

    }
  });
});