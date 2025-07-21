const mongoose = require("mongoose");

const SaleItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  itemType: {
    type: String,
    enum: ["product", "service"],
    required: true,
  },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  category: { type: String, required: false },
  duration: { type: String, required: false },
});

const SaleSchema = new mongoose.Schema({
  items: [SaleItemSchema],
  totalAmount: { type: Number, required: true },
  customerName: { type: String, required: false },
  customerEmail: { type: String, required: false },
  customerPhone: { type: String, required: false },
  paymentMethod: {
    type: String,
    enum: ["dinheiro", "cartao_credito", "cartao_debito", "pix", "transferencia"],
    required: true,
  },
  status: {
    type: String,
    enum: ["concluida", "cancelada", "pendente"],
    default: "concluida",
  },
  notes: { type: String, required: false },
  soldBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

SaleSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Sale", SaleSchema); 