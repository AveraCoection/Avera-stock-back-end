const Buyer = require("../models/buyers");

// Add Post
const addBuyer = (req, res) => {
    const addBuyer = new Buyer({
      userID: req.body.userId,
    buyer_name: req.body.buyer_name,
    phone_number: req.body.phone_number,
    });
  
    addBuyer
      .save()
      .then((result) => {
        res.status(200).send({
          message : "Buyer created successfully"
          ,result :result});
      })
      .catch((err) => {
        res.status(402).send(err);
      });
  };

// Get All 
const getAllBuyer = async (req, res) => {

    const findAllBuyer = await Buyer.find({
      userID: req.params.userId,
    })
    res.json(findAllBuyer);
  };

  // Delete 
  const deleteSelectedBuyer = async (req, res) => {
    const deleteCalaloge = await Buyer.deleteOne(
      { _id: req.params.id }
    );
    res.send(deleteCalaloge);
  };

  // Edit 
  const editBuyer = (req, res) => {
    Buyer.findById(req.params.id)
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
  const updateBuyer = (req, res) => {
    Buyer.findByIdAndUpdate(
      { _id: req.body.id }, 
      {
        buyer_name: req.body.buyer_name,  
        phone_number: req.body.phone_number,
      },
      { new: true } 
    )
      .then((updatedResult) => {
        if (!updatedResult) {
          return res.status(404).send("Buyer not found");
        }
        res.json(updatedResult);
      })
      .catch((error) => {
        res.status(400).json({ error: error.message }); 
      });
  };
  
  



  module.exports = {
    addBuyer,
   getAllBuyer,
   deleteSelectedBuyer,
  updateBuyer,
  editBuyer,
  };
  