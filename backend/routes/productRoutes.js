const express = require("express");
const { createProduct } = require("../controllers/productController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/create-product",protect, createProduct );

module.exports = router;
