const mongoose = require("mongoose");

const PlannerSchema = new mongoose.Schema({
  paciente: { type: String, required: true },
  service: { type: String },
  contact: { type: String },
  responsible: { type: String },
  notes: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  endDate: { type: String, required: true },
  endTime: { type: String, required: true },
  eventId: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Planner", PlannerSchema);
