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
      grandTotal : req.body.grandTotal,
      buyer_phone :req.body.buyer_phone,
      inVoice:req.body.inVoice,
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

const deleteSelectedBill = async (req, res) => {
  const deleteBill = await Sold.deleteOne(
    { _id: req.params.id }
  );
  res.send(deleteBill);
};

const editBill = (req, res) => {
  Sold.findById(req.params.id)
    .then((billDetail) => {
      if (!billDetail) {
        return res.status(404).json({ message: "Bill not found" });
      }

      res.json(billDetail);
    })
    .catch((error) => {
      res.status(500).json({ message: "Server error", error });
    });
};

module.exports = { addSolds ,getSoldData ,deleteSelectedBill , editBill};
