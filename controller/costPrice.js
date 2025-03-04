const CatalogeDesign = require("../models/catalogDesign");
const CostPrice = require("../models/costPrice");

// Add Post
const addCostPrice = (req, res) => {
  const addCostPrice = new CostPrice({
    userID: req.body.userId,
    cost_type: req.body.cost_type,
    cost_name: req.body.cost_name,
    design_bill: req.body.design_bill,
    commission_name: req.body.commission_name,
    commission_type: req.body.commission_type,
  });

  addCostPrice
    .save()
    .then((result) => {
      res.status(200).send({
        message: "CostPrice created successfully"
        , result: result
      });
    })
    .catch((err) => {
      res.status(402).send(err);
    });
};

// Get All CATALOGE
const getAllCostPrice = async (req, res) => {

  const findAllCataloge = await CostPrice.find({
    userID: req.params.userId,
  }).sort({ _id: -1 })

  res.json(findAllCataloge);
};

// Delete CATALOGE
const deleteSelectedCostPrice = async (req, res) => {
  const deleteCalaloge = await CostPrice.deleteOne(
    { _id: req.params.id }
  );
  res.send(deleteCalaloge);
};


const editCostPrice = async (req, res) => {
  try {
    const costPrice = await CostPrice.findById(req.params.id);

    if (!costPrice) {
      return res.status(404).json({ message: "Catalog not found" });
    }

    const designs = await CatalogeDesign.find({ costPrice: costPrice._id });

    const totalKhazana = designs.reduce((sum, design) => sum + (design.khazana_stock || 0), 0);

    res.json({
      _id: costPrice._id,
      userID: costPrice.userID,
      cost_type: costPrice.cost_type,
      createdAt: costPrice.createdAt,
      updatedAt: costPrice.updatedAt,
      total_khazana: totalKhazana,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// update Post
const updateCostPrice = (req, res) => {
  CostPrice.findByIdAndUpdate(
    { _id: req.params.id },
    { cost_type: req.body.cost_type, cost_name: req.body.cost_name,
       design_bill: req.body.design_bill ,
       commission_name : req.body.commission_name,
       commission_type : req.body.commission_type,
        },
    { new: true }
  )
    .then((updatedResult) => {
      if (!updatedResult) {
        return res.status(404).send("CostPrice not found");
      }
      res.json(updatedResult);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};




module.exports = {
  addCostPrice,
  getAllCostPrice,
  deleteSelectedCostPrice,
  updateCostPrice,
  editCostPrice,
};
