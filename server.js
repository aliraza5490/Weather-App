const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const apiCaller = require("./api_caller");
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(express.static("public"));
app.use("/api/getWeather", apiCaller.giveWeather);
app.use("/api/getLocation", apiCaller.giveLocation)
app.listen(5500, console.log("Server is listening on 5500."));