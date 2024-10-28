const Cataloge = require("../models/cataloge");

// Add Post
const addCataloge = (req, res) => {
    const addCataloge = new Cataloge({
      userID: req.body.userId,
    cataloge_number: req.body.cataloge_number,
    });
  
    addCataloge
      .save()
      .then((result) => {
        res.status(200).send({
          message : "Cataloge created successfully"
          ,result :result});
      })
      .catch((err) => {
        res.status(402).send(err);
      });
  };

// Get All CATALOGE
const getAllCataloge = async (req, res) => {

    const findAllCataloge = await Cataloge.find({
      userID: req.params.userId,
    })
    res.json(findAllCataloge);
  };

  // Delete CATALOGE
  const deleteSelectedCataloge = async (req, res) => {
    const deleteCalaloge = await Cataloge.deleteOne(
      { _id: req.params.id }
    );
    res.send(deleteCalaloge);
  };

  // Edit 
  const editCataloge = (req, res) => {
    Cataloge.findById(req.params.id)
      .then((cataloge) => {
        if (!cataloge) {
          return res.status(404).json({ message: "Catalog not found" });
        }
  
        res.json(cataloge);
      })
      .catch((error) => {
        res.status(500).json({ message: "Server error", error });
      });
  };
  
  

  // update Post
  const updateCataloge = (req, res) => {
    Cataloge.findByIdAndUpdate(
      { _id: req.body.id },                             
      { cataloge_number: req.body.cataloge_number },    
      { new: true }                                     
    )
      .then((updatedResult) => {
        if (!updatedResult) {
          return res.status(404).send("Cataloge not found");
        }
        res.json(updatedResult);
      })
      .catch((error) => {
        res.status(400).json({ error: error.message });
      });
  };
  



  module.exports = {
    addCataloge,
   getAllCataloge,
   deleteSelectedCataloge,
  updateCataloge,
  editCataloge,
  };
  