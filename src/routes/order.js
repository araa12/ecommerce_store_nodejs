const router = require("express").Router();
const Order = require("../models/Order");
const {
  verifyTokenAndAdmin,
  verifyTokenAndAuth,
  verifyToken,
} = require("./verify_token");

//Create New Order
router.post("/", verifyToken, async (req, res) => {
  const newOrder = Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res
      .status(200)
      .json({ message: "Cart Created SuccessFully", product: savedOrder });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

//Update Product
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({
      message: "Cart Updated SuccessFully",
      product: updatedOrder,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

///Delete Cart
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Order Deleted SuccessFully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

///Get User CArt
router.get("/cart/:userId", verifyTokenAndAuth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get Monthly Income
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },

      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },

        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
