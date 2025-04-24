const express = require("express");
const {
  getDentists,
  applyCheckup,
  getCheckupResults,
  exportCheckupToPDF,
  deleteCheckup, // Add the deleteCheckup controller here
} = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

// Routes for the user dashboard
router.get("/dentists", auth("user"), getDentists);
router.post("/apply", auth("user"), applyCheckup);
router.get("/results", auth("user"), getCheckupResults);
router.get("/export/:id", auth("user"), exportCheckupToPDF);

// Route for deleting checkup results
router.delete("/results/:id", auth("user"), deleteCheckup);

module.exports = router;
