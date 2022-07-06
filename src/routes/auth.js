const User = require("../models/User.js");
const CryptoJS = require("crypto-js");
const router = require("express").Router();
const jwt = require('jsonwebtoken');

///Register

router.post("/register", async (req, res) => {
 // const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const fullName = req.body.fullName;
  const address = req.body.address;

  const user = await User.findOne({ email: email });
  if(user){
    res.status(401).json({ message: "Email already registered with another account"});
    return;
  }
  
  const newUser = new User({
    email: email,
    fullName: fullName,
    address: address,
    password: CryptoJS.AES.encrypt(password, process.env.PASS_KEY).toString(),
    // isAdmin: req.body.isAdmin
  });
  try {
    const savedUser = await newUser.save();
    res.status(200).json({
      message: "User Created SuccessFully",
      user: savedUser,
    });
  } catch (err) {
  
      res.status(500).json({message: err});
    
    console.log(err);
  }
});

//Login
router.post("/login", async (req, res) => {
  const email = req.body.email;
  const orginalpass = req.body.password;

  try {

    const user = await User.findOne({ email: email});

    if(!user){
      res.status(401).json({ message: "No User Exists on Server" })
      return;
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_KEY
    );

    const pass = hashedPassword.toString(CryptoJS.enc.Utf8);

    if(pass !== orginalpass){
      res.status(401).json({ message: "Wrong Password" });
      return;
    }

    const { password, ...others } = user._doc;

    const accessToken = await jwt.sign({
        id: user._id,
        isAdmin: user.isAdmin,
    },process.env.JWT_KEY,{
        expiresIn: "360d"
    });

    res.status(200).json({
    accessToken,
    ...others});
  }

   catch (err) {
       console.log(err);
     res.status(500).json({message:err});
  }
});



module.exports = router;
