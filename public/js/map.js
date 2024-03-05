mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12',
    center: listing.geometry.coordinates, // starting position [longitude, latitude]
    zoom: 12 // starting zoom
});

/* console.log(coordinates) */
/* MARER ON THE MAP! */

 // Create a default Marker and add it to the map.
 const marker1 = new mapboxgl.Marker({ color: 'red', rotation: 0 })
 .setLngLat(listing.geometry.coordinates)
 .setPopup(new mapboxgl.Popup({offset: 25})
 .setHTML(`<h6>${listing.title}</h6>
 <p>Exact location will be provided after booking</P>`))
 .addTo(map);

