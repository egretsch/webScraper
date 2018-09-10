// Dependencies
var express = require("express");

const logger = require('morgan');

var app = express();
var bodyParser = require("body-parser");
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
let routes = require('./routes/api-routes.js');
var exphbs = require("express-handlebars");
var PORT = process.env.PORT || 3000;
// var path = require('path');
var mongojs = require("mongojs");
// Serve static content for the app from the "public" directory in the application directory.
// Initialize Express

app.set("view engine", "handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }, { useNewUrlParser: true } ));
app.use(bodyParser.json());
app.use(routes);
app.use(logger('dev'));



// This makes sure that any errors are logged if mongodb runs into an issue
// db.on("error", function (error) {
//   console.log("Database Error:", error);
// });

// Set the app to listen on port 3000
app.listen(PORT, function () {
  console.log("App running on port 3000!");
});

