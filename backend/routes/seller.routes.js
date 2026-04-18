const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");

const router = express.Router();

function ensureValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

router.get("/orders/:sellerId", async (req, res) => {
  const { sellerId } = req.params;
  if (!ensureValidObjectId(sellerId)) {
    return res.status(400).json({ message: "Invalid sellerId" });
  }

  const orders = await Order.find({ "items.sellerId": sellerId }).populate("buyerId", "name email").sort({ createdAt: -1 });
  const sellerOrders = orders.map((order) => {
    const sellerItems = order.items.filter((item) => String(item.sellerId) === String(sellerId));
    const sellerTotal = sellerItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      _id: order._id,
      buyerId: order.buyerId?._id || order.buyerId,
      buyerName: order.buyerId?.name || "Unknown Buyer",
      buyerEmail: order.buyerId?.email || "",
      paymentMethod: order.paymentMethod,
      status: order.status,
      createdAt: order.createdAt,
      sellerItems,
      sellerTotal
    };
  });

  return res.json(sellerOrders);
});

module.exports = router;
