var map = L.map('map').setView([37.8, -96], 4);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Define the city data
const cities = [
  { ABR: "CLT", name: "Charlotte, North Carolina", lat: 35.22709, lon: -80.84313 },
  { ABR: "CQT", name: "Los Angeles, California", lat: 34.05223, lon: -118.24368 },
  { ABR: "IND", name: "Indianapolis, Indiana", lat: 39.76838, lon: -86.15804 },
  { ABR: "JAX", name: "Jacksonville, Florida", lat: 30.33218, lon: -81.65565 },
  { ABR: "MDW", name: "Chicago, Illinois", lat: 41.85003, lon: -87.65005 },
  { ABR: "PHL", name: "Philadelphia, Pennsylvania", lat: 39.95233, lon: -75.16379 },
  { ABR: "PHX", name: "Phoenix, Arizona", lat: 33.44838, lon: -112.07404 },
  { ABR: "KHOU", name: "Houston, Texas", lat: 29.76328, lon: -95.36327 },
  { ABR: "KNYC", name: "New York, New York", lat: 40.71427, lon: -74.00597 },
  { ABR: "KSEA", name: "Seattle, Washington", lat: 47.60621, lon: -122.33207 }
];

// Listen to the form's submit event
d3.select("#date-form").on("submit", function() {
  d3.event.preventDefault(); // prevent page from reloading

  // Get the selected start and end dates from the form
  const startDate = d3.select("#start-date").property("value");
  const endDate = d3.select("#end-date").property("value");

  // Filter the precipitation data for each city to only include dates within the selected range
  Promise.all(cities.map(function (city) {
    return d3.csv("../WeatherData/" + city.ABR + ".csv").then(function (precipitation) {
      city.precipitation = precipitation.filter(function(d) {
        const date = new Date(d.date);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });

      const averagePrecipitation = d3.mean(city.precipitation, function (d) {
        return parseFloat(d.average_precipitation);
      });
      
      if (city.circle) {
        // Remove the existing circle marker if it already exists
        map.removeLayer(city.circle);
      }
      var circle = L.circleMarker([city.lat, city.lon], {
        radius: averagePrecipitation * 100,
        fillColor: "blue",
      }).addTo(map);
      
      city.circle = circle;
      // Update the circle marker for the city with the new average precipitation value
      circle.setRadius(averagePrecipitation * 100);
      circle.bindPopup(`<b>${city.name}</b><br>Average precipitation: ${averagePrecipitation} inches`);
    });
  }));
});




