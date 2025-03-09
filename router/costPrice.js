const express = require("express");
const app = express();
const costPrice = require("../controller/costPrice");

app.post("/add",costPrice.addCostPrice );

app.get("/list_costPrice/:userId",costPrice.getAllCostPrice );

app.delete("/delete_costPrice/:id",costPrice.deleteSelectedCostPrice );

app.get("/edit_costPrice/:id",costPrice.editCostPrice );

app.put("/update_costPrice/:id",costPrice.updateCostPrice );


module.exports = app;
