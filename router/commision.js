const express = require("express");
const app = express();
const commision =  require("../controller/commision");

app.post("/add", commision.createCommission);
app.get("/get-commision/:userId", commision.getAllCommissions);
app.get("/edit/:id", commision.getCommissionById);
app.put("/update/:id", commision.updateCommission);
app.delete("/delete/:id", commision.deleteCommission);

module.exports = app;
 