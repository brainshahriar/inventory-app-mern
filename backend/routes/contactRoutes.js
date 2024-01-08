const express = require("express");
const { createContact } = require("../controllers/contactUsController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/create", protect, createContact);

module.exports = router;
