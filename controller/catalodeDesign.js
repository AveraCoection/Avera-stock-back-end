const CatalogeDesign = require("../models/catalogDesign");

// Add Post
const addCatalogeDesign = (req, res) => {
  const addCataloge = new CatalogeDesign({
    userID: req.body.userId,
    design_number: req.body.design_number,
    stock: req.body.stock,
    cataloge: req.body.cataloge,
  });

  addCataloge
    .save()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(402).send(err);
    });
};

const listCatalogeDesigns = async (req, res) => { 
  const findAllCataloge = await CatalogeDesign.find({
    cataloge: req.params.cataloge,
  })
  res.status(200).json(findAllCataloge);
};

const deleteCatalogeDesign = async (req, res) => {
  const deleteCalaloge = await CatalogeDesign.deleteOne(
    { _id: req.params.id }
  );
  res.send(deleteCalaloge);
};

const editDesign = (req, res) => {
  CatalogeDesign.findById(req.params.id)
    .then((cataloge) => {
      if (!cataloge) {
        return res.status(404).json({ message: "design not found" });
      }

      res.json(cataloge);
    })
    .catch((error) => {
      res.status(500).json({ message: "Server error", error });
    });
};

const updateDesign = async (req, res) => {
  const sellStock = Number(req.body.sell_stock); 
  const totalStock = Number(req.body.stock);
  let remainingStock = 0;

  if (totalStock < sellStock) {
    return res.status(400).send("Sold stock cannot be greater than total stock");
  }

  if (sellStock > 0) {
    remainingStock = totalStock - sellStock;
  } else if (sellStock === 0){
    remainingStock = totalStock
  }
  else {
    const design = await CatalogeDesign.findById(req.params.id);
    if (!design) {
      return res.status(404).send("Design not found");
    }
    
    remainingStock = design.stock + totalStock; 

  }
  CatalogeDesign.findByIdAndUpdate(
    req.params.id, 
    { stock: remainingStock }, 
    { new: true }
  )
  .then((updatedResult) => {
    if (!updatedResult) {
      return res.status(404).send("Design not found");
    }
    res.json(updatedResult);
  })
  .catch((error) => {
    res.status(400).json({ error: error.message });
  });
};



module.exports = {
  addCatalogeDesign,
  listCatalogeDesigns,
  deleteCatalogeDesign,
  editDesign,
  updateDesign
};
