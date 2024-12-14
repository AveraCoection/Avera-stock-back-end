const express = require("express");
const app = express();
const buyer = require("../controller/buyer");

app.post("/add",buyer.addBuyer );

app.get("/list_buyer/:userId",buyer.getAllBuyer );

app.delete("/delete_buyer/:id",buyer.deleteSelectedBuyer );

app.get("/edit_buyer/:id",buyer.editBuyer );

app.put("/update_buyer/:id",buyer.updateBuyer );


module.exports = app;
