const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: false },
  quantity: { type: Number, required: true },
  validity: { type: Date, required: false },
  price: { type: Number, required: true },
  supplier: { type: String, required: false },
  composition: { type: String, required: false },
  imageUrl: { type: String, required: false } 
});

module.exports = mongoose.model("Product", ProductSchema);