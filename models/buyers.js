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
    }
   
  },
  { timestamps: true }
);


const Buyer = mongoose.model("Buyer", BuyersSchema);
module.exports = Buyer;
