const Sold = require("../models/SoldCataloge");
const CatalogeDesign  = require("../models/catalogDesign");

// Add Sales

const addSolds = async (req, res) => {
  try {
    for (const catalogue of req.body.catalogues) {
      const { catalogeId, designId, khazana } = catalogue;
      const design = await CatalogeDesign.findById(designId);

      if (!design) {
        return res.status(404).json({ message: `Design with id ${designId} not found` });
      }

      if (design.khazana_stock >= khazana) {
        design.khazana_stock -= khazana;

        await design.save();
      } else {
        return res.status(400).json({ message: `Not enough stock for design ${designId}` });
      }
    }

    const addSold = new Sold({
      userID: req.body.userID,
      buyer: req.body.buyer, 
      catalogues: req.body.catalogues,
    });

    // Save the Sold record
    const result = await addSold.save();
    res.status(200).json({ message: "Sale added successfully", data: result });

  } catch (err) {
    res.status(400).json({ message: "Error adding sale", error: err });
  }
};


const getSoldData = async (req, res) => {
  const findAllSalesData = await Sold.find({"userID": req.params.userID})
    .sort({ _id: -1 })
  res.json(findAllSalesData);
};
module.exports = { addSolds ,getSoldData };
