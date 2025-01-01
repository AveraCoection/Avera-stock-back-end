const express = require("express");
const app = express();
const sold = require("../controller/SoldCataloge");


app.post("/adds", sold.addSolds);
app.get("/get-sales/:userID", sold.getSoldData);
app.delete("/delete_bill/:id", sold.deleteSelectedBill);
app.get("/get-bill/:id", sold.editBill);


module.exports = app;

