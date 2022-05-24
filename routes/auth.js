const User = require("../models/user");
const CryptoJS = require("crypto-js");
const router = require("express").Router();
const jwt = require('jsonwebtoken');

///Register

router.post("/register", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  // const validated = await validateInputs();

  const newUser = new User({
    username: username,
    email: email,
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
    res.status(500).json(err);
    console.log(err);
  }
});

//Login

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const orginalpass = req.body.password;

  try {
    const user = await User.findOne({ username: username })
    !user && res.status(401).json({ message: "No User Exists" });

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_KEY
    );

    const pass = hashedPassword.toString(CryptoJS.enc.Utf8);
    pass !== orginalpass && res.status(401).json({ message: "Wrong Password" });

    const { password, ...others } = user._doc;

    const accessToken = await jwt.sign({
        id: user._id,
        isAdmin: user.isAdmin,
    },process.env.JWT_KEY,{
        expiresIn: "7d"
    });

    res.status(200).json({
    accessToken,
    ...others});
  }

   catch (err) {
       console.log(err);
    // res.status(500).json(err);
  }
});

module.exports = router;
