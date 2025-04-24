const mongoose = require("mongoose");

const checkupSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dentist: { type: mongoose.Schema.Types.ObjectId, ref: "Dentist" },
  images: [String],
  notes: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Checkup", checkupSchema);
