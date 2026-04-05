const params = new URLSearchParams(window.location.search)
const locationName = params.get("location")

var map = L.map('map').setView([20, 78], 5)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map)

fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${locationName}`)
    .then(res => res.json())
    .then(data => {

        if (data.length == 0) {
            alert("Location not found")
            return
        }

        let lat = data[0].lat
        let lon = data[0].lon

        map.setView([lat, lon], 13)

        L.marker([lat, lon])
            .addTo(map)
            .bindPopup(locationName)
            .openPopup()

    })