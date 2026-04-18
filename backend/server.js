require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/products.routes");
const orderRoutes = require("./routes/orders.routes");
const sellerRoutes = require("./routes/seller.routes");

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      const allowed = (
        process.env.FRONTEND_URLS || "http://localhost:5173,http://127.0.0.1:5173"
      )
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (!origin || allowed.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin not allowed by CORS: ${origin}`));
    }
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/seller", sellerRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

async function start() {
  const port = Number(process.env.PORT || 4000);
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecom";
  await mongoose.connect(mongoUri);
  console.log("Mongo connected")
  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
