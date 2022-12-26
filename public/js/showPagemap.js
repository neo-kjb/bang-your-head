mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: concert.geometry.coordinates,
  zoom: 4,
})

new mapboxgl.Marker({ color: 'black', rotation: 45 })
  .setLngLat(concert.geometry.coordinates)
  .addTo(map)
