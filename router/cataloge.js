const express = require("express");
const app = express();
const cataloge = require("../controller/cataloge");

app.post("/add",cataloge.addCataloge );

app.get("/list_cataloge/:userId",cataloge.getAllCataloge );

app.delete("/delete_cataloge/:id",cataloge.deleteSelectedCataloge );

app.get("/edit_cataloge/:id",cataloge.editCataloge );

app.put("/update_cataloge/:id",cataloge.updateCataloge );


module.exports = app;
