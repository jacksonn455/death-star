const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  quantity: { type: Number },
  validity: { type: Date },
  price: { type: Number },
  supplier: { type: String },
  composition: { type: String },
  image: { type: String }
});

module.exports = mongoose.model("Product", ProductSchema);