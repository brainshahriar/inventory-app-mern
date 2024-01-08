const express = require("express");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");
const protect = require("../middleware/authMiddleware");
const { upload } = require("../utils/fileUpload");
const router = express.Router();

router.post("/create-product", protect, upload.single("image"), createProduct);
router.get("/get-all-products", protect, getAllProducts);
router.get("/get-single-product/:id", protect, getSingleProduct);
router.delete("/delete-product/:id", protect, deleteProduct);
router.post(
  "/update-product/:id",
  protect,
  upload.single("image"),
  updateProduct
);

module.exports = router;
