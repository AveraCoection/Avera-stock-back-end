const mongoose = require("mongoose");

const CommissionSchema = new mongoose.Schema({
     userID: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "users",
         required: true,
       },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["Sale", "Agent"],
        required: true
    },
    commissionPrice: {
        type: Number,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model("Commission", CommissionSchema);
