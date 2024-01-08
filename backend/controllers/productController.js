const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const productModel = require("../models/productModel");

const createProduct = asyncHandler(async (req, res) => {
  const{name,sku,category,quantity,price,description} = req.body;
  if(!name || !category || !price || !description){
      response.status(400)
      throw new Error("Please fill all fields")
  } 
  // image upload

  //create product
  const product = await productModel.create({
    user:req.user._id,
    name,
    sku,
    category,
    quantity,
    price,
    description
  })
  res.status(201).json(product);

  });

module.exports = { createProduct };
