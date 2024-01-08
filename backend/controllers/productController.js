const asyncHandler = require("express-async-handler");
const productModel = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

//create a product
const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;
  if (!name || !category || !price || !description) {
    res.status(400);
    throw new Error("Please fill all fields");
  }
  // handle image upload
  let fileData = {};
  if (req.file) {
    //save to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Inventory App",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }
    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
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
    image: fileData,
  });
  res.status(201).json(product);
});
//get products
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await productModel
    .find({ user: req.user._id })
    .sort("-createdAt");
  res.status(200).json(products);
});
//get single products
const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await productModel.findById(req.params.id);
  if (!product) {
    throw new Error("Product not found");
  }
  if (product.user.toString() !== req.user.id) {
    throw new Error("Unauthorized");
  }
  res.status(200).json(product);
});
//delete single products
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await productModel.findById(req.params.id);
  if (!product) {
    throw new Error("Product not found");
  }
  if (product.user.toString() !== req.user.id) {
    res.status(404);
    throw new Error("Unauthorized");
  }
  await productModel.deleteOne({ _id: req.params.id });
  res.status(200).json({
    message: "Product deleted successfully",
  });
});
//update single products
const updateProduct = asyncHandler(async (req, res) => {
  const { name, category, quantity, price, description } = req.body;

  const product = await productModel.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.user.toString() !== req.user.id) {
    res.status(404);
    throw new Error("Unauthorized");
  }
  // handle image upload
  let fileData = {};
  if (req.file) {
    //save to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Inventory App",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }
    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }
  //update product
  const updatedProduct = await productModel.findByIdAndUpdate(
    { _id: req.params.id },
    {
      name,
      category,
      quantity,
      price,
      description,
      image: Object.keys(fileData).length === 0 ? product.image : fileData,
    },
    {
      new: true,
      runValidaotrs: true,
    }
  );
  res.status(200).json(updatedProduct);
});

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
};
