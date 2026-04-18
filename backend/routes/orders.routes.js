const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const router = express.Router();

function getUserId(req) {
  return req.header("x-user-id") || req.body.userId || req.params.userId || req.query.userId;
}

function ensureValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

router.post("/", async (req, res) => {
  const buyerId = getUserId(req);
  const { items, paymentMethod } = req.body;

  if (!buyerId || !ensureValidObjectId(buyerId)) {
    return res.status(400).json({ message: "Valid userId is required" });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "items are required" });
  }
  if (paymentMethod !== "COD") {
    return res.status(400).json({ message: "Only COD payment is supported" });
  }

  const buyer = await User.findById(buyerId);
  if (!buyer) {
    return res.status(404).json({ message: "Buyer not found" });
  }

  const normalizedItems = [];
  for (const item of items) {
    const productId = item.productId;
    const quantity = Number(item.quantity || 1);
    if (!productId || !ensureValidObjectId(productId) || quantity < 1) {
      return res.status(400).json({ message: "Each item must have valid productId and quantity >= 1" });
    }
    normalizedItems.push({ productId, quantity });
  }

  const productIds = normalizedItems.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((p) => [String(p._id), p]));

  const orderItems = [];
  let totalAmount = 0;
  for (const item of normalizedItems) {
    const product = productMap.get(String(item.productId));
    if (!product) {
      return res.status(404).json({ message: `Product not found: ${item.productId}` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ message: `Insufficient stock for ${product.title}` });
    }

    product.stock -= item.quantity;
    await product.save();

    orderItems.push({
      productId: product._id,
      sellerId: product.sellerId,
      title: product.title,
      description: product.description || "",
      imageUrl: product.imageUrl || "",
      price: product.price,
      quantity: item.quantity
    });
    totalAmount += product.price * item.quantity;
  }

  const order = await Order.create({
    buyerId,
    items: orderItems,
    totalAmount,
    paymentMethod: "COD"
  });

  return res.status(201).json(order);
});

router.get("/my/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!ensureValidObjectId(userId)) {
    return res.status(400).json({ message: "Invalid userId" });
  }

  const orders = await Order.find({ buyerId: userId }).sort({ createdAt: -1 });
  return res.json(orders);
});

router.get("/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const userId = getUserId(req);

  if (!ensureValidObjectId(orderId)) {
    return res.status(400).json({ message: "Invalid orderId" });
  }
  if (!userId || !ensureValidObjectId(userId)) {
    return res.status(400).json({ message: "Valid userId is required" });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const canViewAsBuyer = String(order.buyerId) === String(userId);
  const canViewAsSeller = order.items.some((item) => String(item.sellerId) === String(userId));
  if (!canViewAsBuyer && !canViewAsSeller) {
    return res.status(403).json({ message: "You are not allowed to view this order" });
  }

  if (canViewAsSeller && !canViewAsBuyer) {
    const sellerItems = order.items.filter((item) => String(item.sellerId) === String(userId));
    const sellerTotal = sellerItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return res.json({
      ...order.toObject(),
      items: sellerItems,
      totalAmount: sellerTotal
    });
  }

  return res.json(order);
});

router.patch("/:orderId/cancel", async (req, res) => {
  const { orderId } = req.params;
  const userId = getUserId(req);

  if (!ensureValidObjectId(orderId)) {
    return res.status(400).json({ message: "Invalid orderId" });
  }
  if (!userId || !ensureValidObjectId(userId)) {
    return res.status(400).json({ message: "Valid userId is required" });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const canCancelAsBuyer = String(order.buyerId) === String(userId);
  const canCancelAsSeller = order.items.some((item) => String(item.sellerId) === String(userId));
  if (!canCancelAsBuyer && !canCancelAsSeller) {
    return res.status(403).json({ message: "You are not allowed to cancel this order" });
  }
  if (order.status === "CANCELLED") {
    return res.status(400).json({ message: "Order is already cancelled" });
  }
  if (order.status === "DELIVERED") {
    return res.status(400).json({ message: "Delivered orders cannot be cancelled" });
  }

  order.status = "CANCELLED";
  await order.save();
  return res.json(order);
});

module.exports = router;
