/**
 * Interactive map
 * @requires https://github.com/Leaflet/Leaflet
 */

export default (() => {
  const mapList = document.querySelectorAll('.interactive-map')

  if (mapList.length === 0) return

  for (let i = 0; i < mapList.length; i++) {
    const mapOptions = mapList[i].dataset.mapOptions
    let map

    // Map options: Inline JSON data
    if (mapOptions && mapOptions !== '') {
      const mapOptionsObj = JSON.parse(mapOptions),
        mapLayer =
          mapOptionsObj.mapLayer ||
          'https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=BO4zZpr0fIIoydRTOLSx',
        mapCenter = mapOptionsObj.center ? mapOptionsObj.center : [0, 0],
        mapZoom = mapOptionsObj.zoom || 1,
        scrollWheelZoom = mapOptionsObj.scrollWheelZoom === false ? false : true,
        markers = mapOptionsObj.markers

      // Map setup
      /* eslint-disable no-undef */
      map = L.map(mapList[i], {
        scrollWheelZoom: scrollWheelZoom,
      }).setView(mapCenter, mapZoom)

      // Tile layer
      L.tileLayer(mapLayer, {
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        attribution:
          '\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
        crossOrigin: true,
      }).addTo(map)

      // Markers
      if (markers) {
        for (let n = 0; n < markers.length; n++) {
          const iconUrl = markers[n].iconUrl,
            shadowUrl = markers[n].shadowUrl,
            markerIcon = L.icon({
              iconUrl: iconUrl || 'assets/img/map/marker-icon.png',
              iconSize: [30, 43],
              iconAnchor: [14, 43],
              shadowUrl: shadowUrl || 'assets/img/map/marker-shadow.png',
              shadowSize: [41, 41],
              shadowAnchor: [13, 41],
              popupAnchor: [1, -40],
            }),
            popup = markers[n].popup

          const marker = L.marker(markers[n].position, {
            icon: markerIcon,
          }).addTo(map)

          if (popup) {
            marker.bindPopup(popup)
          }
        }
      }

      // Map option: No options provided
    } else {
      map = L.map(mapList[i]).setView([0, 0], 1)

      L.tileLayer(
        'https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=BO4zZpr0fIIoydRTOLSx',
        {
          tileSize: 512,
          zoomOffset: -1,
          minZoom: 1,
          attribution:
            '\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
          crossOrigin: true,
        }
      ).addTo(map)
    }
    /* eslint-enable no-undef */
  }
})()
