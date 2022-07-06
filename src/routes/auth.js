const User = require("../models/User.js");
const CryptoJS = require("crypto-js");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

///Register

router.post("/register", async (req, res) => {
 // const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const fullName = req.body.fullName;
  const address = req.body.address;




  // const newUser =s new User({
  //   email: email,
  //   fullName: fullName,
  //   address: address,
  //   password: CryptoJS.AES.encrypt(password, process.env.PASS_KEY).toString(),
  //   // isAdmin: req.body.isAdmin
  // });
  try {

    if (!(email && password && fullName && address )) {
     return res.status(400).json({message: "All input is required"});
    }
    

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    

    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      fullName: fullName,
      address: address,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

     // Create token
     const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(200).json({message: "User Created Successfully", user: user});

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

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(orginalpass, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "30d",
        }
      );

      // save user token
      user.token = token;

      const { password, ...others } = user._doc;


      // user
      res.status(200).json({access_token:token, user: others});
    }
    // res.status(400).send("Invalid Credentials");
    // if(pass !== orginalpass){
    //   res.status(401).json({ message: "Wrong Password" });
    //   return;
    // }

    res.status(400).json({message: "Invavlid Credentials"});

  }
   catch (err) {
       console.log(err);
     res.status(500).json({message:err});
  }
});



module.exports = router;
