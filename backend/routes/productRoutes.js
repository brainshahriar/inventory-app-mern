const express = require("express");
const { createProduct } = require("../controllers/productController");
const protect = require("../middleware/authMiddleware");
const { upload } = require("../utils/fileUpload");
const router = express.Router();

router.post("/create-product", protect, upload.single("image"), createProduct);

module.exports = router;
