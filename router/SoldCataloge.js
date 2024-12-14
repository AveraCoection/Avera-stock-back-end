const express = require("express");
const app = express();
const sold = require("../controller/SoldCataloge");


app.post("/adds", sold.addSolds);
app.get("/get-sales/:userID", sold.getSoldData);


module.exports = app;
