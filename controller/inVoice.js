const InVoice = require("../models/InVoice");

// Add Invoice
const addInvoice = (req, res) => {
  const addInvoice = new InVoice({
    in_voice: req.body.in_voice,
    userID: req.body.userID,
  });

  addInvoice
    .save()
    .then((result) => {
      res.status(200).send({
        message: "Invoice created successfully",
        result: result,
      });
    })
    .catch((err) => {
      res.status(402).send(err);
    });
};

// Get Next Invoice
const getNextInvoice = async (req, res) => {
  const userID = req.params.userID
  try {
    let latestInvoice = await InVoice.findOne({ userID }).sort({ in_voice: -1 });

    if (!latestInvoice) {
      latestInvoice = new InVoice({ in_voice: 10003, userID });
      await latestInvoice.save();
    } else {
      latestInvoice = new InVoice({ in_voice: latestInvoice.in_voice, userID });
      await latestInvoice.save();
    }

    const formattedInvoice = latestInvoice.in_voice.toString().padStart(4, "0");

    res.status(200).json({
      message: "Next invoice number generated successfully",
      invoiceNumber: formattedInvoice,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getNextInvoice,
  addInvoice,
};
