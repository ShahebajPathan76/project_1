require('dotenv').config();
const express = require('express');
const app=express();
const DBConnection=require('./database/db');
const User=require("./models/User");
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const cors = require('cors');
const submitRoute = require("./routes/submit");
const problemRoutes = require('./routes/problemRoutes');
const friendsRoutes = require("./routes/friendsRoutes");


const submissionsRoute = require('./routes/submission');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({

  origin: [
      "https://hack-arena.info",
      "https://hack-arena-pi.vercel.app/",
      "https://www.hack-arena.info",
    "http://localhost:5173"], // or "*"
  credentials: true,
}));

DBConnection();

app.use("/api/submit", submitRoute);

app.use("/api/problems", problemRoutes);
app.use("/api/friends", friendsRoutes);



app.use('/api/submission', submissionsRoute);

app.post("/register",async (req,res)=>{
   try {
     //first thing is to get all the data from frontend
     const {firstname,lastname,email,password}=req.body;
    //check that all the data should exist
    console.log(req.body);
    if(!(firstname&&lastname&&email&&password)){
        return res.status(400).send("please enter all the data");
    }
    //check if user already exists
    const existingUser=await User.findOne({email});
    if(existingUser){
        return res.status(400).send("User already exist with same email");
    }
    //hashing/encrpt the password
    const hashedPassword=await bcrypt.hash(password,10);
    //save the user in db
    const user=await User.create({
        firstname,
        lastname,
        email,
        password:hashedPassword,
    });
    //generate the token for the user and send to it

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: "1h" });
    // console.log("Generated token:", token);

    const userObj = user.toObject();
userObj.token = token;
delete userObj.password;

res.status(200).json({ message: "login successful", user: userObj });
   
   } catch (error) {
    console.log(error);
   }
});

app.post("/login",async (req,res)=>{
try {
    const {email,password}=req.body;
    //check if email and password are provided
    if(!(email&&password)){
        return res.status(400).send("please enter email and password");
    }
    //find the user by email
    const user=await User.findOne({email});
    if(!user||!(await bcrypt.compare(password,user.password) )){
        return res.status(404).send("invalid email or password");
    }
    //gen a token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: "1h" });
    // console.log("Generated token:", token);

    const userObj = user.toObject();
    userObj.token = token;
    delete userObj.password;

    res.status(200).json({ message: "login successful", user: userObj });
} catch (error) {
    console.log(error);
    res.status(500).send("server error")
}
});
const verifyToken = require('./middleware/verifyToken');

app.get("/Profile", verifyToken, async (req, res) => {
  // 💬 "Only a logged-in user can reach me!"
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

//
const axios = require("axios");

app.post("/api/ai-review", async (req, res) => {
  try {
    const response = await axios.post(`${process.env.VITE_COMPILER_URL}/api/ai-review`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error proxying AI Review:", error.message);
    res.status(500).json({ success: false, error: "AI review failed (proxy)." });
  }
});
app.post("/api/run", async (req, res) => {
  try {
    const response = await axios.post(`${process.env.VITE_COMPILER_URL}/api/run`, req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Error proxying run request:", err.message);
    res.status(500).json({ verdict: "Execution Failed", error: err.message });
  }
});

app.listen(process.env.PORT,()=>{
    console.log(`server listening ${process.env.PORT}!`);
});