const API_KEY = "38f9264b8e345e5059d64b5e08c19663";
const BASE_URL = "http://api.openweathermap.org/data/2.5/weather?appid=" + API_KEY + "&units=metric&lang=fr&q=";

function getWeatherData(city, callback) {
  const url = BASE_URL + city;
    fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); 
    })
    .then(data => {
      callback(null, data); 
    })
    .catch(error => {
      callback(error, null);
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