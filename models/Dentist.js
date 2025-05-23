const mongoose = require("mongoose");

const dentistSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

module.exports = mongoose.model("Dentist", dentistSchema);
