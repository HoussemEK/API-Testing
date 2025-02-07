const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const db = require("./database");
const session = require("express-session");
const Keycloak = require("keycloak-connect");
const memoryStore = new session.MemoryStore();
const axios = require("axios");

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// 1. CORS Configuration: Allow all origins
app.use(cors());
// To restrict to allowed domains, uncomment and adapt the following line:
// app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:4200'] }));

// 2. Rate Limiting Configuration: 100 requests/15 min
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message:
    "Too many requests made from this IP, please try again after 15 minutes.",
});
app.use(limiter);

// Configure session middleware
app.use(
  session({
    secret: "api-secret",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

// Configure Keycloak
const keycloak = new Keycloak({ store: memoryStore }, "./keycloak-config.json");
app.use(keycloak.middleware());

app.get("/", (req, res) => {
  res.json("Registre de personnes! Choisissez le bon routage!");
});
// Récupérer toutes les personnes
app.get("/personnes", keycloak.protect(), (req, res) => {
  db.all("SELECT * FROM personnes", [], (err, rows) => {
    if (err) {
      res.status(400).json({
        error: err.message,
      });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});
// Récupérer une personne par ID
app.get("/personnes/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM personnes WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(400).json({
        error: err.message,
      });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});
// Créer une nouvelle personne
app.post("/personnes", (req, res) => {
  const { nom, adresse } = req.body;
  db.run(
    `INSERT INTO personnes (nom, adresse) VALUES (?, ?)`,
    [nom, adresse],
    function (err) {
      if (err) {
        res.status(400).json({
          error: err.message,
        });
        return;
      }
      res.json({
        message: "success",
        data: {
          id: this.lastID,
        },
      });
    }
  );
});
// Mettre à jour une personne
app.put("/personnes/:id", (req, res) => {
  const { nom, adresse } = req.body;
  const { id } = req.params;
  db.run(
    `UPDATE personnes SET nom = ?, adresse = ? WHERE id = ?`,
    [nom, adresse, id],
    function (err) {
      if (err) {
        res.status(400).json({
          error: err.message,
        });
        return;
      }
      res.json({
        message: "success",
        data: { id: id },
      });
    }
  );
});
// Supprimer une personne
app.delete("/personnes/:id", (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM personnes WHERE id = ?`, id, function (err) {
    if (err) {
      res.status(400).json({
        error: err.message,
      });
      return;
    }
    res.json({
      message: "success",
    });
  });
});

// Example: Protect a route with Keycloak
app.get("/secure", keycloak.protect(), (req, res) => {
  res.json({ message: "Vous êtes authentifié !" });
});

// Save a comment and analyze sentiment
app.post("/comments", async (req, res) => {
  const { name, address, comment } = req.body;

  try {
    // Call the Flask API for sentiment analysis
    const response = await axios.post("http://localhost:5000/analyze", {
      comment: comment,
    });

    const sentiment = response.data.sentiment;

    // Save the comment along with sentiment to SQLite
    db.run(
      `INSERT INTO comments (name, address, comment, sentiment) VALUES (?, ?, ?, ?)`,
      [name, address, comment, sentiment],
      function (err) {
        if (err) {
          res.status(400).json({
            error: err.message,
          });
          return;
        }
        res.json({
          message: "success",
          data: {
            id: this.lastID,
            sentiment: sentiment,
          },
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      error: "Error analyzing sentiment",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
