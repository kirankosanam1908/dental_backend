const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Dentist = require("../models/Dentist");

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const Model = role === "dentist" ? Dentist : User;

  try {
    const existing = await Model.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Model({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password, role } = req.body;
  const Model = role === "dentist" ? Dentist : User;

  try {
    const user = await Model.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, user: { id: user._id, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };
