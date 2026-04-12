const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); 

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/users");


// const uri = "mongodb+srv://aqsashamshad2005_db_user:1BVnzEVn1gNhjg5T@avera.e2vui7t.mongodb.net/?appName=Avera"
const uri = "mongodb+srv://averacollection147:GBN0pCqQ7SMblwbL@cluster0.mhivx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


async function main() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4
        });

        console.log("Connected to MongoDB!");

        // Get the collection
        const db = mongoose.connection;
        const collection = db.collection("users");

        const hashedPassword1 = await User.hashPassword("password123");
        const hashedPassword2 = await User.hashPassword("securePass456");

        const users = [
            { email: "user1@example.com", password: hashedPassword1, firstName: "Avera", lastName: "Collection", role: "Admin" },
            { email: "user2@example.com", password: hashedPassword2, firstName: "Avera", lastName: "Collection", role: "Staff" }
        ];


        for (let user of users) {

            await collection.updateOne(
                { email: user.email },
                { $set: user },
                { upsert: true }
            );
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

module.exports = { main };