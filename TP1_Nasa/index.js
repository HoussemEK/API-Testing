// Exemple de code pour faire une requête API en utilisant la librairie 'request'
const request = require("request");

const API_KEY = "48GWkebDy1NGx3mkhah5jnoRHut0WSBLPh94kyit"; 
const BASE_URL = "https://api.nasa.gov/planetary/earth/imagery?api_key=" + API_KEY; 

function getEarthImage(longitude, latitude, date, callback) {
    const url = BASE_URL + "&lon=" + longitude + "&lat=" + latitude + "&date=" + date; 
    request(url, function (error, response) {
        if (error) {
            callback(error, null);
        } else {
            // Check if the response is an image
            const contentType = response.headers['content-type'];
            if (contentType && contentType.includes('image/')) {
                // Return the URL of the image
                callback(null, { imageUrl: url });
            } else {
                callback(new Error("Response is not an image. Content-Type: " + contentType), null);
            }
        }
    });
}

// Exemple d'utilisation (Sousse)
getEarthImage("10.6360", "35.8256", "2018-01-01", (error, imageData) => {
    if (error) {
        console.error("Erreur lors de la récupération de l'image :", error);
    } else {
        console.log("URL de l'image :", imageData.imageUrl); 
    }
});
