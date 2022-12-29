mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: concert.geometry.coordinates,
  zoom: 4,
})

map.addControl(new mapboxgl.NavigationControl())

new mapboxgl.Marker({ color: 'black', rotation: 45 })
  .setLngLat(concert.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${concert.title}</h3><p>${concert.location}</p>`,
    ),
  )
  .addTo(map)
