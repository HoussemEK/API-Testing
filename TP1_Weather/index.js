// Exemple de code pour faire une requête API en utilisant la librairie 'request'
const request = require("request");

const API_KEY = "38f9264b8e345e5059d64b5e08c19663";
const BASE_URL = "http://api.openweathermap.org/data/2.5/weather?appid=" + API_KEY + "&units=metric&lang=fr&q=";

function getWeatherData(city, callback) {
const url = BASE_URL + city;
request(url, function (error, response, body) {
if (error) {
callback(error, null);
} else {
const weatherData = JSON.parse(body);
callback(null, weatherData);
}
});
}

getWeatherData("Sousse", (error, weatherData) => {
  if (error) {
  console.error("Erreur lors de la récupération des données météorologiques :", error);
  } else {
  console.log("Données météorologiques pour Sousse :", weatherData);
  console.log("Température :", weatherData.main.temp);
  console.log("Conditions météorologiques :", weatherData.weather[0].description);
  console.log("Humidité :", weatherData.main.humidity);
  }
  });