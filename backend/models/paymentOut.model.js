const mongoose = require("mongoose");

const paymentOutSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true }, // Link to Purchase
    supplierName: { type: String, required: true },
    billingAddress: { type: String, required: true },
    paymentDate: { type: Date, required: true },
    amountPaid: { type: Number, required: true }
});

module.exports = mongoose.model("PaymentOut", paymentOutSchema);
