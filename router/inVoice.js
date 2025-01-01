const express = require("express");
const app = express();
const inVoice = require("../controller/inVoice");

app.post("/add_inVoice",inVoice.addInvoice );

app.get("/last_inVoice",inVoice.getNextInvoice );



module.exports = app;
