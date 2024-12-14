const mongoose = require("mongoose");

const CatalogeDesignSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
   
     cataloge: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Cataloge",
      required: true,
    },
    design_number: {
      type: String,
      required: true,
      unique : true,
    },
    stock: {
        type: Number,
        required: true,
      },
      khazana_stock: {
        type: Number,
        required: true,
      },
      sell_stock : {
        type: Number,
      },
      price : {
        type : Number,
      }

  },
  { timestamps: true }
);


const CatalogeDesign = mongoose.model("CatalogeDesign", CatalogeDesignSchema);
module.exports = CatalogeDesign;
