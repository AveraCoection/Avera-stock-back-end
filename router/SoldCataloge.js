const express = require("express");
const app = express();
const sold = require("../controller/SoldCataloge");


app.post("/adds", sold.addSolds);
app.get("/get-sales/:userID", sold.getSoldData);
app.get("/get-sales/:buyerID", sold.getSoldData);
app.delete("/delete_bill/:id", sold.deleteSelectedBill);
app.get("/get-bill/:id", sold.editBill);
app.put("/update-bill/:id", sold.updateBill);
app.post("/deduct-payment/:userID", sold.deductTotalBill);  

module.exports = app;

