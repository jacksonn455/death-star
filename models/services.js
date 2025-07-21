const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["facial", "corporal", "pos_operatorio"], 
    required: true 
  },
  duration: { type: String, required: true }, // Duração aproximada
  price: { type: Number, required: true },
  description: { type: String, required: false },
  isActive: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ServiceSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Service", ServiceSchema); 