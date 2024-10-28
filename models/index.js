const mongoose = require("mongoose");
// const uri = "mongodb+srv://Sohail2637:rHgxrh24OJ7brZsh@averacollection.92wat.mongodb.net/?retryWrites=true&w=majority&appName=AveraCollection"
const uri = "mongodb+srv://averacollection147:GBN0pCqQ7SMblwbL@cluster0.mhivx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

function main() {
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then(() => {
        console.log("Succesfull")
    
    }).catch((err) => {
        console.log("Error: ", err)
    })
}

module.exports = { main };