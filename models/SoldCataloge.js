const mongoose = require("mongoose");

const SoldSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        buyer: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        grandTotal :{
            type: Number,
            required: true,
        },
        discount :{
            type: Number,
            required: true,

        },
        inVoice:{
            type: Number,
            required: true, 
        },
        paid :{
            type : Boolean,
        },
        buyer_phone:{
            type: Number,
        },
        catalogues: [
            {
                catalogeId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Cataloge",
                    required: true,
                },
                designId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "CatalogeDesign",
                    required: true,
                },
                khazana: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

const Sold = mongoose.model("Sold", SoldSchema);
module.exports = Sold;
