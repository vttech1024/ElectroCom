const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const User = require("../models/User");

const router = express.Router();

function getUserId(req) {
  return req.header("x-user-id") || req.body.userId || req.params.userId || req.query.userId;
}

function ensureValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

router.get("/", async (req, res) => {
  const q = (req.query.q || "").trim();
  const type = (req.query.type || "").trim();
  const filter = {};

  if (q) {
    filter.$or = [{ title: { $regex: q, $options: "i" } }, { description: { $regex: q, $options: "i" } }];
  }

  if (type) {
    filter.type = { $regex: `^${type}$`, $options: "i" };
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });
  return res.json(products);
});

router.get("/seller/:sellerId", async (req, res) => {
  const { sellerId } = req.params;
  if (!ensureValidObjectId(sellerId)) {
    return res.status(400).json({ message: "Invalid sellerId" });
  }

  const products = await Product.find({ sellerId }).sort({ createdAt: -1 });
  return res.json(products);
});

router.get("/:productId", async (req, res) => {
  const { productId } = req.params;
  if (!ensureValidObjectId(productId)) {
    return res.status(400).json({ message: "Invalid productId" });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  return res.json(product);
});

router.post("/", async (req, res) => {
  const userId = getUserId(req);
  if (!userId || !ensureValidObjectId(userId)) {
    return res.status(400).json({ message: "Valid userId is required" });
  }

  const seller = await User.findById(userId);
  if (!seller) {
    return res.status(404).json({ message: "Seller not found" });
  }

  const { title, type, description, price, stock, imageUrl } = req.body;
  if (!title || !type || !description || Number(price) < 0 || Number(stock) < 0) {
    return res.status(400).json({ message: "title, type, description, price >= 0, stock >= 0 required" });
  }

  const safeImageUrl =
    typeof imageUrl === "string" && imageUrl.trim()
      ? imageUrl.trim()
      : `https://picsum.photos/seed/${encodeURIComponent(title)}/1200/900`;

  const product = await Product.create({
    title,
    type,
    description,
    price: Number(price),
    stock: Number(stock),
    imageUrl: safeImageUrl,
    sellerId: userId
  });

  return res.status(201).json(product);
});

module.exports = router;
