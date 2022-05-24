const router = require('express').Router();
const Product = require('../models/Product');
const { verifyTokenAndAdmin, verifyTokenAndAuth } = require('./verify_token');

//Create New Product 
router.post('/', verifyTokenAndAdmin, async (req,res)=> {
    const product = Product(req.body);

    try{
const savedProduct = await product.save();
res.status(200).json({message: "Product Added SuccessFully", product: savedProduct});
    }catch(err){
        res.status(500).json({"error": err});
    }
});


//Update Product
router.put("/:id",verifyTokenAndAdmin, async (req,res)=> {
    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,{
            $set: req.body
        },
        {new: true});
        res.status(200).json({message: "Product Updated SuccessFully", product: updatedProduct});
    }catch(err){
        res.status(500).json(err);
    }
});


router.delete("/:id",verifyTokenAndAdmin, async (req,res)=> {
    try{
    await Product.findByIdAndDelete(req.params.id);
     res.status(200).json({message: "Product Deleted SuccessFully",});
    }catch(err){
        res.status(500).json(err);
    }
});


///Get Product
router.get("/find/:id",verifyTokenAndAdmin, async (req,res)=> {
  
    try{
   const currentProduct =  await Product.findById(req.params.id);
   res.status(200).json(currentProduct);
    }catch(err){
        res.status(500).json(err);
    }
});

//Get All Product
router.get("/", async (req,res)=> {

   const  qNew = req.query.new;
   const qCategory = req.query.category;
   let products;

 
    try{
        if(qNew){
            products= await Product.find().sort({createdAt: -1}).limit(5);

        }else if(qCategory){
            products= await Product.find({categories: {
                $in: [qCategory]
            }});

        }else{
            products = await Product.find();
        }

     res.status(200).json(products);
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;