const Sold = require("../models/SoldCataloge");
const Buyer = require("../models/buyers");
const CatalogeDesign = require("../models/catalogDesign");

// Add Sales

const addSolds = async (req, res) => {
  const buyer = req.body.buyer;
  const buyerId = buyer.value;

  try {
    // Step 1: Update stock for each design
    for (const catalogue of req.body.catalogues) {
      const { designId, khazana } = catalogue;
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

    // Step 2: Save the new bill
    const addSold = new Sold({
      userID: req.body.userID,
      buyer: req.body.buyer,
      catalogues: req.body.catalogues,
      grandTotal: req.body.grandTotal,
      buyer_phone: req.body.buyer_phone,
      inVoice: req.body.inVoice
    });

    await addSold.save();

    // Step 3: Get all bills related to this buyer
    const buyerBills = await Sold.find({ "buyer.value": buyerId });

    // Step 4: Calculate the total bill amount
    const totalBillAmount = buyerBills.reduce((sum, bill) => sum + bill.grandTotal, 0);

    // Step 5: Fetch the buyer's paid amount
    const buyerData = await Buyer.findById(buyerId);
    const paidAmount = buyerData?.paid_amount || 0; // Default to 0 if not set

    // Step 6: Calculate remaining amount
    const remainingAmount = totalBillAmount - paidAmount;

    // Step 7: Update buyer's totalBill & remaining_amount
    await Buyer.findByIdAndUpdate(buyerId, {
      totalBill: totalBillAmount,
      remaining_amount: remainingAmount
    });
    res.status(200).json({
      message: "Sale added successfully",
      billId: addSold._id,
      totalBill: totalBillAmount,
      remainingAmount: remainingAmount
    });

  } catch (err) {
    res.status(400).json({ message: "Error adding sale", error: err });
  }
};


const getSoldData = async (req, res) => {
  try {
    const filter = { userID: req.params.userID };

    if (req.query.buyerID) {
      filter["buyer.value"] = req.query.buyerID;
    }
    const findAllSalesData = await Sold.find(filter).sort({ _id: -1 });

    res.json(findAllSalesData);
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ error: "Error fetching sales data" });
  }
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


const updateBill = (req, res) => {
  Sold.findByIdAndUpdate(
    { _id: req.params.id },
    { paid: req.body.paid },
    { new: true }
  )
    .then((updatedResult) => {
      if (!updatedResult) {

        return res.status(404).send("Cost Price not found");
      }
      res.json(updatedResult);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

const deductTotalBill = async (req, res) => {
  try {
    const { amount } = req.body;
    const { buyerID } = req.query;

    // Validate input
    if (!buyerID) {
      return res.status(400).json({ error: "Buyer ID is required" });
    }
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Amount must be a positive number" });
    }

    // Fetch buyer details
    const buyer = await Buyer.findById(buyerID);
    if (!buyer) {
      return res.status(404).json({ error: "Buyer not found" });
    }

    // Check if deduction exceeds remaining amount
    if (amount > buyer.remaining_amount) {
      return res.status(400).json({ error: "Deduction amount exceeds remaining balance" });
    }

    // Update remaining_amount & paid_amount and add transaction record
    const updatedBuyer = await Buyer.findByIdAndUpdate(
      buyerID,
      {
        $inc: {
          paid_amount: amount, // Increase paid_amount
          remaining_amount: -amount // Decrease remaining_amount
        },
        $push: {
          transactions: {
            amountPaid: amount,
            date: new Date(),
            note: "Payment received"
          }
        }
      },
      { new: true } // Return the updated document
    );

    res.json({
      message: "Payment deducted successfully",
      remainingAmount: updatedBuyer.remaining_amount,
      totalPaid: updatedBuyer.paid_amount,
      transactions: updatedBuyer.transactions // Return updated transactions
    });

  } catch (error) {
    console.error("Error deducting total bill:", error);
    res.status(500).json({ error: "Error deducting total bill" });
  }
};



module.exports = { addSolds, getSoldData, deleteSelectedBill, editBill, updateBill, deductTotalBill };
