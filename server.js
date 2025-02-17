const express = require("express");
const { main } = require("./models/index");
const productRoute = require("./router/product");
const storeRoute = require("./router/store");
const purchaseRoute = require("./router/purchase");
const salesRoute = require("./router/sales");
const catalogeRoute = require("./router/cataloge");
const catalogeDesignRoute = require("./router/catalogeDesign");
const buyerRoute = require("./router/buyer");
const soldRoute = require("./router/SoldCataloge");
const inVoiceRoute = require("./router/inVoice")
const userRoutes = require("./router/users")
const cors = require("cors");
const User = require("./models/users");
const Product = require("./models/product");

require("dotenv").config()

const app = express();
const PORT = process.env.PORT;
main();
app.use(express.json());
app.use(cors());

// Store API
app.use("/api/store", storeRoute);

// Products API
app.use("/api/product", productRoute);

// Purchase API
app.use("/api/purchase", purchaseRoute);

// Sales API
app.use("/api/sales", salesRoute);

// cataloge api 
app.use("/api/cataloge", catalogeRoute);

// cataloge Design api 
app.use("/api/cataloge_design", catalogeDesignRoute);

// buyer api
app.use("/api/buyer", buyerRoute);

// sold cataloge api
app.use("/api/sold_design", soldRoute);

app.use("/api/in_voice", inVoiceRoute);

app.use("/api/auth" , userRoutes)
// ------------- Signin --------------
// let userAuthCheck;
// app.post("/api/login", async (req, res) => {
//   console.log(req.body);
//   try {
//     const user = await User.findOne({
//       email: req.body.email,
//       password: req.body.password,
//     });
//     if (user) {
//       res.send(user);
//       userAuthCheck = user;
//     } else {
//       res.status(401).send("Invalid Credentials");
//       userAuthCheck = null;
//     }
//   } catch (error) {
//     console.log(error);
//     res.send(error);
//   }
// });

// Getting User Details of login user


// app.post("/api/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     console.log(user , "user")
//     // if (!user) return res.status(401).json({ message: "Invalid Credentials" });

//     // const isMatch = await bcrypt.compare(password, user.password);
//     // if (!isMatch) return res.status(401).json({ message: "Invalid Credentials" });

//     // // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     // res.json({ message: "Login Successful", user });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });


app.get("/api/login", (req, res) => {
  res.send("hello")
  // res.send(userAuthCheck);
});
// ------------------------------------

// Registration API


// app.post("/api/register", async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, imageUrl } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     console.log(password, "password")
//     const hashedPassword = await bcrypt.hash(password, 10);
//     console.log(hashedPassword, "hashedPassword")
//     const registerUser = new User({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//       imageUrl,
//     });

//     const savedUser = await registerUser.save();
//     res.status(201).json({ message: "Signup successful", user: savedUser });

//   } catch (err) {
//     console.error("Signup error: ", err);
//     if (err.code === 11000) {
//       return res.status(400).json({ message: "Email is already registered" });
//     }

//     res.status(500).json({ message: "Internal server error" });
//   }
// });



app.get("/", async (req, res) => {
  res.send("hello developers")
})
app.get("/testget", async (req, res) => {
  const result = await Product.findOne({ _id: '6429979b2e5434138eda1564' })
  console.log("result");
  res.json(result)
})

// Here we are listening to the server
app.listen(PORT, () => {
  console.log("I am live again");
});
