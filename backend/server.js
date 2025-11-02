// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const tenantRoutes = require("./routes/tenants");
const propertyRoutes = require("./routes/properties");
const paymentRoutes = require("./routes/payments");

// Use routes
app.use("/api/tenants", tenantRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/payments", paymentRoutes);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
