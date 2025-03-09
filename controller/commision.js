const Commission = require("../models/commision");

// Create a new commission
const createCommission = async (req, res) => {

  const addCommision = new Commission({
    userID: req.body.userId,
    commissionPrice: req.body.commissionPrice,
    type: req.body.type,
    name: req.body.name,
  });
  addCommision
    .save()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(402).send(err);
    });
};

// Get all commissions
const getAllCommissions = async (req, res) => {
  try {
    const commissions = await Commission.find({ userID: req.params.userId, });
    res.json(commissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single commission by ID
const getCommissionById = async (req, res) => {
  try {
    const commission = await Commission.findById(req.params.id);
    if (!commission) return res.status(404).json({ message: "Not Found" });
    res.json(commission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a commission by ID
const updateCommission = async (req, res) => {
  try {
    const { name, type, commissionPrice } = req.body;
    const updatedCommission = await Commission.findByIdAndUpdate(
      req.params.id, { name, type, commissionPrice }, { new: true }
    );
    res.json(updatedCommission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a commission by ID
const deleteCommission = async (req, res) => {
  try {
    await Commission.findByIdAndDelete(req.params.id);
    res.json({ message: "Commission Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createCommission,
  getAllCommissions,
  getCommissionById,
  updateCommission,
  deleteCommission,
};
