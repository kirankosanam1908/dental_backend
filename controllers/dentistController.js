const Checkup = require("../models/Checkup");
const path = require("path");

const getCheckupRequests = async (req, res) => {
  try {
    const checkups = await Checkup.find({ dentist: req.user.id }).populate(
      "patient",
      "name email"
    );
    res.json(checkups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const uploadCheckupResult = async (req, res) => {
  try {
    const { checkupId } = req.body;
    const checkup = await Checkup.findById(checkupId);
    if (!checkup) return res.status(404).json({ message: "Checkup not found" });

    const imagePaths = req.files.map((file) => file.filename);
    const { notes } = req.body;

    checkup.images.push(...imagePaths);
    checkup.notes.push(...JSON.parse(notes)); // notes are sent as JSON array
    await checkup.save();

    res.json({ message: "Checkup result uploaded successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCheckupRequests, uploadCheckupResult };
