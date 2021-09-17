// Import the express npm module
const express = require("express");

// Import the morgan npm module
const logger = require("morgan");

// Import the mongoose npm module
const mongoose = require("mongoose");

// Import the compression npm module
const compression = require("compression");

// Define the PORT
const PORT = process.env.PORT || 3001;

// Define the mongodb database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/budget";

// Create an instance of the express app
const app = express();

// Middleware
app.use(logger("dev"));

// Middleware for express
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware for sending the contents of the public folder to the client
app.use(express.static("public"));

// Connect to the database
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false
});

// Import the API routes
app.use(require("./routes/api.js"));

// Start the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});