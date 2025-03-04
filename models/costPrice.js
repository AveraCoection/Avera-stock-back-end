const mongoose = require("mongoose");

const CostPriceSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        cost_type: {
            type: String,
            required: true,
        },
        cost_name: {
            type: Number,
            required: true,
        },
        commission_name: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Commission",
        },
        commission_type: {
            type: String,
            enum: ["Sale", "Agent"],
        },
        design_bill: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CostPrice",
            required: true,
        }
    },
    { timestamps: true }
);


const CostPrice = mongoose.model("CostPrice", CostPriceSchema);
module.exports = CostPrice;
