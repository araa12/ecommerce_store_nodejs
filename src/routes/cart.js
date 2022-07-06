const router = require("express").Router();
const Cart = require("../models/Cart");
const {
  verifyTokenAndAdmin,
  verifyTokenAndAuth,
  verifyToken,
} = require("./verify_token");

//Create New Cart
router.post("/", verifyTokenAndAuth, async (req, res) => {
  
    const newCart = Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res
      .status(200)
      .json({ message: "Cart Created SuccessFully", product: savedCart });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

//Update Product
router.put("/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({
      message: "Cart Updated SuccessFully",
      product: updatedCart,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

///Delete Cart
router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Cart Deleted SuccessFully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

///Get User CArt
router.get("/:userId", verifyTokenAndAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({message: err});
  }
});

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
      const carts = await Cart.find();
        res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
