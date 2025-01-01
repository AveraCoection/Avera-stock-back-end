const mongoose = require("mongoose");

const InVoiceSchema = new mongoose.Schema(
  {
    // userID: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "users",
    //   required: true,
    // },
   
    in_voice :{
        type : Number,
        required : true,
           }
   
  },
  { timestamps: true }
);


const InVoice = mongoose.model("InVoice", InVoiceSchema);
module.exports = InVoice;
