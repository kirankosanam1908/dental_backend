const express = require("express");
const multer = require("multer");
const {
  getCheckupRequests,
  uploadCheckupResult,
} = require("../controllers/dentistController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/requests", auth("dentist"), getCheckupRequests);
router.post(
  "/upload",
  auth("dentist"),
  upload.array("images"),
  uploadCheckupResult
);

module.exports = router;
