const express = require("express");
const app = express();
const catalogeDesign = require("../controller/catalodeDesign");

app.post("/add_design",catalogeDesign.addCatalogeDesign );
app.get("/list_design/:cataloge",catalogeDesign.listCatalogeDesigns );
app.get("/edit_design/:id",catalogeDesign.editDesign );
app.put("/update_design/:id",catalogeDesign.updateDesign );
app.delete("/delete_design/:id",catalogeDesign.deleteCatalogeDesign );




module.exports = app;
