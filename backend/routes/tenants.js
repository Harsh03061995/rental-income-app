// routes/tenants.js
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

// ➕ Add new tenant
router.post("/", async (req, res) => {
  try {
    const {
      full_name,
      phone_number,
      email,
      address,
      kra_pin,
      id_number,
      lease_start,
      lease_end,
      property_location,
      rent_amount,
      rent_cutoff_date,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO tenants 
      (full_name, phone_number, email, address, kra_pin, id_number, lease_start, lease_end, property_location, rent_amount, rent_cutoff_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [
        full_name,
        phone_number,
        email,
        address,
        kra_pin,
        id_number,
        lease_start,
        lease_end,
        property_location,
        rent_amount,
        rent_cutoff_date,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 📋 Get all tenants
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tenants ORDER BY tenant_id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update tenant
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { phone_number, email, address } = req.body;

    const result = await pool.query(
      "UPDATE tenants SET phone_number=$1, email=$2, address=$3 WHERE tenant_id=$4 RETURNING *",
      [phone_number, email, address, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Delete tenant
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query("DELETE FROM tenants WHERE tenant_id=$1", [id]);
    res.json({ message: "Tenant deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
