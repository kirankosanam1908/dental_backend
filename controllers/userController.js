const Dentist = require("../models/Dentist");
const Checkup = require("../models/Checkup");
const path = require("path");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const getDentists = async (req, res) => {
  try {
    const dentists = await Dentist.find({}, "name email");
    res.json(dentists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const applyCheckup = async (req, res) => {
  const { dentistId } = req.body;

  try {
    const checkup = new Checkup({
      patient: req.user.id,
      dentist: dentistId,
      images: [],
      notes: [],
    });

    await checkup.save();
    res.status(201).json({ message: "Checkup request created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCheckupResults = async (req, res) => {
  try {
    const checkups = await Checkup.find({ patient: req.user.id }).populate(
      "dentist",
      "name email"
    );
    res.json(checkups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const exportCheckupToPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const checkup = await Checkup.findById(id).populate("dentist", "name");

    if (!checkup || checkup.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `../uploads/report-${id}.pdf`);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(16).text(`Dental Checkup Report - ${checkup.dentist.name}`);
    doc.moveDown();

    checkup.notes.forEach((note, idx) => {
      doc.fontSize(14).text(`Note ${idx + 1}: ${note}`);
      const imagePath = path.join(__dirname, "../uploads", checkup.images[idx]);
      if (fs.existsSync(imagePath)) {
        doc.image(imagePath, { fit: [300, 300] }).moveDown();
      }
    });

    doc.end();

    stream.on("finish", () => {
      res.download(filePath, `report-${id}.pdf`, () => fs.unlinkSync(filePath));
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Checkup Result
const deleteCheckup = async (req, res) => {
  const { id } = req.params;

  try {
    const checkup = await Checkup.findById(id);

    if (!checkup || checkup.patient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Access denied or checkup not found" });
    }

    await checkup.remove(); // Remove the checkup from the database
    res.status(200).json({ message: "Checkup result deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getDentists,
  applyCheckup,
  getCheckupResults,
  exportCheckupToPDF,
  deleteCheckup, // Export deleteCheckup function
};
