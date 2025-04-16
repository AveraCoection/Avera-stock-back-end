const express = require("express");
const mongoose = require("mongoose");
const Sold = require("../models/SoldCataloge"); // adjust the path if needed
const router = express.Router();

router.get("/:catalogueId", async (req, res) => {
  try {
    const { catalogueId } = req.params;
    const { type = "monthly" } = req.query;

    // Choose how to group based on report type
    const groupBy =
      type === "yearly"
        ? {
            year: { $year: "$createdAt" },
            design_number: "$designDetails.design_number",
            price: "$designDetails.price",
          }
        : type === "monthly"
        ? {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            design_number: "$designDetails.design_number",
            price: "$designDetails.price",
          }
        : {
            year: { $year: "$createdAt" },
            week: { $week: "$createdAt" },
            design_number: "$designDetails.design_number",
            price: "$designDetails.price",
          };

    // Aggregate sold catalog data
    const report = await Sold.aggregate([
      { $unwind: "$catalogues" },
      {
        $match: {
          "catalogues.catalogeId": new mongoose.Types.ObjectId(catalogueId),
        },
      },
      {
        $lookup: {
          from: "catalogedesigns", // your design collection
          localField: "catalogues.designId",
          foreignField: "_id",
          as: "designDetails",
        },
      },
      { $unwind: "$designDetails" },
      {
        $group: {
          _id: groupBy,
          totalKhazanaSold: { $sum: "$catalogues.khazana" },
        },
      },
      {
        $group: {
          _id: "$_id.design_number",
          totalKhazanaSold: { $sum: "$totalKhazanaSold" },
          price: { $first: "$_id.price" }, // keeping the first found price
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
