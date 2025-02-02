const request = require("request");

const RANDOM_USER_URL = "https://randomuser.me/api/";

function getRandomUser(callback) {
    request(RANDOM_USER_URL, function (error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            const userData = JSON.parse(body);
            callback(null, userData);
        }
    });
}
// Test the Random User Generator API
getRandomUser((error, userData) => {
    if (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error);
    } else {
        console.log("Données utilisateur générées :", userData);
        console.log("Nom :", userData.results[0].name.first, userData.results[0].name.last);
        console.log("Email :", userData.results[0].email);
        console.log("Téléphone :", userData.results[0].phone);
    }
});

