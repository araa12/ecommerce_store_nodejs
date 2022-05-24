const router = require('express').Router();
const user = require('../models/user');
const User = require('../models/user');
const {verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin} = require('../routes/verify_token');

 router.put("/:id",verifyTokenAndAuth, async (req,res)=> {
     if(req.body.password){
         req.body.password = CryptoJS.AES.encrypt(req.body.password,process.env.JWT_KEY).toString();
     }

     try{
         const updatedUser = await User.findByIdAndUpdate(req.params.id,{
             $set: req.body
         },
         {new: true});

         const { password, ...others } = updatedUser._doc;

         res.status(200).json({message: "User Updated SuccessFully", user: others});
     }catch(err){
         res.status(500).json(err);
     }
 });


 router.delete("/:id",verifyTokenAndAuth, async (req,res)=> {
  

    try{
    await User.findByIdAndDelete(req.params.id);

     res.status(200).json({message: "User Deleted SuccessFully",});
    }catch(err){
        res.status(500).json(err);
    }
});

///Get User 
 router.get("/find/:id",verifyTokenAndAdmin, async (req,res)=> {
  
    try{
   const updatedUser =  await User.findById(req.params.id);

//    const { password, ...others } = updatedUser._doc;
   res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json(err);
    }
});



///GetAllUsers
router.get("/",verifyTokenAndAdmin, async (req,res)=> {
  
    try{
   const updatedUser =  await User.find();

//    const { password, ...others } = updatedUser._doc;
   res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json(err);
    }
});


module.exports = router;