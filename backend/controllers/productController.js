const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const productModel = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");

const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;
  if (!name || !category || !price || !description) {
    response.status(400);
    throw new Error("Please fill all fields");
  }
  // handle image upload
  let fileData = {};
  if (req.file) {
    fileData = {
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }
  //create product
  const product = await productModel.create({
    user: req.user._id,
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image:fileData
  });
  res.status(201).json(product);
});

module.exports = { createProduct };
