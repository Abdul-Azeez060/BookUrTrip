mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: listing.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
});

console.log(listing.geometry);

const popup = new mapboxgl.Popup({ offset: 20 })
  .setLngLat(listing.geometry.coordinates)
  .setHTML(`<p>Exact location will be provided after booking</p>`)
  .addTo(map);

// Create a DOM element for each marker.
const el = document.createElement("div");
el.className = "marker";
el.style.backgroundImage = `url("https://cdn4.vectorstock.com/i/1000x1000/94/93/home-line-icon-on-red-background-flat-style-vector-31309493.jpg")`;
el.style.width = `30px`;
el.style.height = `30px`;
el.style.backgroundSize = "100%";
el.style.boxShadow = "3px 3px 50px red";

el.addEventListener("click", () => {
  window.alert(marker.properties.message);
});

// Add markers to the map.
// Set marker options.
const marker = new mapboxgl.Marker(el)
  .setLngLat(listing.geometry.coordinates)
  .addTo(map);
