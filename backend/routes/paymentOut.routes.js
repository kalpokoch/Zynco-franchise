const express = require("express");
const PaymentOut = require("../models/paymentOut.model");

const router = express.Router();

/**
 * CREATE - Add a new payment
 */
router.post("/", async (req, res) => {
  try {
    const payment = new PaymentOut(req.body);
    await payment.save();
    res.status(201).json({ message: "Payment recorded successfully", payment });
  } catch (error) {
    res.status(400).json({ message: "Error recording payment", error: error.message });
  }
});

/**
 * READ - Get all payments
 */
router.get("/", async (req, res) => {
  try {
    const payments = await PaymentOut.find();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error: error.message });
  }
});

/**
 * READ - Get a single payment by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const payment = await PaymentOut.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment", error: error.message });
  }
});

/**
 * UPDATE - Update a payment by ID
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedPayment = await PaymentOut.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ message: "Payment updated successfully", payment: updatedPayment });
  } catch (error) {
    res.status(400).json({ message: "Error updating payment", error: error.message });
  }
});

/**
 * DELETE - Delete a payment by ID
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedPayment = await PaymentOut.findByIdAndDelete(req.params.id);
    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting payment", error: error.message });
  }
});

module.exports = router;
