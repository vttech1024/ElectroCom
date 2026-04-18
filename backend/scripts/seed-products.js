require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const User = require("../models/User");

function toType(value) {
  return String(value || "Electronics")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

// Ensures we get a valid image, defaulting to high-quality Unsplash electronics photos
function getSafeImage(item, index, category) {
  if (typeof item.thumbnail === "string" && item.thumbnail.includes("http")) {
    return item.thumbnail;
  }
  // Fallback to high-quality tech imagery based on category
  const keywords = ["tech", "gadget", "computer", "phone"];
  const search = category.toLowerCase();
  return `https://images.unsplash.com/photo-${index}?auto=format&fit=crop&q=80&w=1200&q=electronics,${search}`;
}

async function seed() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecom";
  await mongoose.connect(mongoUri);

  let seller = await User.findOne({ email: "seed.seller@ecom.local" });
  if (!seller) {
    const passwordHash = await bcrypt.hash("Seed@123456", 10);
    seller = await User.create({
      name: "Seed Seller",
      email: "seed.seller@ecom.local",
      passwordHash
    });
  }

  await Product.deleteMany({});

  // Fetch a larger limit to ensure we find enough electronics
  const response = await fetch("https://dummyjson.com/products?limit=194");
  const payload = await response.json();
  
  const electronicCategories = ["smartphones", "laptops", "tablets", "mobile-accessories"];
  
  // Filter for electronics only
  let electronics = payload.products.filter(item => 
    electronicCategories.includes(item.category)
  );

  // If we have fewer than 60, we clone and modify some to reach the target
  // while ensuring unique titles for the UI
  let finalProducts = [...electronics];
  let i = 0;
  while (finalProducts.length < 60) {
    const baseProduct = electronics[i % electronics.length];
    finalProducts.push({
      ...baseProduct,
      title: `${baseProduct.title} (Gen ${Math.floor(finalProducts.length / electronics.length) + 1})`,
      id: `extra-${finalProducts.length}` // prevent key collisions during mapping
    });
    i++;
  }

  const docs = finalProducts.slice(0, 60).map((item, index) => ({
    title: item.title,
    type: toType(item.category),
    description: item.description,
    // Converting USD to INR (approx 85) and ensuring a realistic tech price floor
    price: Math.max(5000, Number(item.price || 1) * 85), 
    stock: Math.max(5, Number(item.stock || 1)),
    imageUrl: getSafeImage(item, index, item.category),
    sellerId: seller._id
  }));

  await Product.insertMany(docs);
  
  const uniqueTypes = [...new Set(docs.map((item) => item.type))];
  console.log(`--- Seed Success ---`);
  console.log(`Seeded: ${docs.length} Electronic items`);
  console.log(`Categories: ${uniqueTypes.join(", ")}`);
  console.log(`--------------------`);

  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error("Seeding failed:", err);
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  process.exit(1);
});