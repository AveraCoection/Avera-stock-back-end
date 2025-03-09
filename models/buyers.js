const mongoose = require("mongoose");

const BuyersSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
   buyer_name: {
      type: String,
      required: true,
    },
    phone_number :{
        type : Number,
        required : true,
    },
    totalBill: {
      type: Number,
      default: 0,
    },
    remaining_amount: {
      type: Number,
      default: 0,
    },
    paid_amount: {
      type: Number,
      default: 0,
    },
   
    transactions: [
      {
        amountPaid: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now, 
        },
      }
      ]
  },
  { timestamps: true }
);


const Buyer = mongoose.model("Buyer", BuyersSchema);
module.exports = Buyer;
