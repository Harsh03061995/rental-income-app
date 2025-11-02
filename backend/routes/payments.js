// routes/payments.js
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

// ➕ Add payment
router.post("/", async (req, res) => {
  try {
    const {
      tenant_id,
      invoice_number,
      rent_month,
      payment_method,
      payment_date,
      mpesa_code,
      cheque_number,
      vat,
      withholding_tax,
      service_charge,
      total_amount
    } = req.body;

    const result = await pool.query(
      `INSERT INTO payments 
       (tenant_id, invoice_number, rent_month, payment_method, payment_date, mpesa_code, cheque_number, vat, withholding_tax, service_charge, total_amount)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [tenant_id, invoice_number, rent_month, payment_method, payment_date, mpesa_code, cheque_number, vat, withholding_tax, service_charge, total_amount]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📋 Get all payments
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, t.full_name AS tenant_name
       FROM payments p
       LEFT JOIN tenants t ON p.tenant_id = t.tenant_id
       ORDER BY p.payment_id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Delete payment
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query("DELETE FROM payments WHERE payment_id=$1", [id]);
    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
