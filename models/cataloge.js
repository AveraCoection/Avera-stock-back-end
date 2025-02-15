const mongoose = require("mongoose");

const CatalogeSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    cataloge_number: {
      type: String,
      required: true,
    },
    total_khazana :{
    type : Number
   }
  },
  { timestamps: true }
);


const Cataloge = mongoose.model("Cataloge", CatalogeSchema);
module.exports = Cataloge;
