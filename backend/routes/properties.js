// routes/properties.js
const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// ➕ Add property
router.post("/", async (req, res) => {
  try {
    const { tenant_id, property_name, location, deposit_amount, photo_url } = req.body;

    const result = await pool.query(
      `INSERT INTO properties (tenant_id, property_name, location, deposit_amount, photo_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [tenant_id, property_name, location, deposit_amount, photo_url]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📋 Get all properties
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, t.full_name AS tenant_name
       FROM properties p
       LEFT JOIN tenants t ON p.tenant_id = t.tenant_id
       ORDER BY p.property_id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update property
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { location, deposit_amount } = req.body;

    const result = await pool.query(
      "UPDATE properties SET location=$1, deposit_amount=$2 WHERE property_id=$3 RETURNING *",
      [location, deposit_amount, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Delete property
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query("DELETE FROM properties WHERE property_id=$1", [id]);
    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
