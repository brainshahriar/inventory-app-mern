const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const createProduct = asyncHandler(async (req, res) => {
  res.send("Hi");
});

module.exports = { createProduct };
