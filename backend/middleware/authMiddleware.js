const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, please login");
    }
    //verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // get user id from token
    const user = await userModel.findById(verified.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("User not found, please login");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, please login");
  }
});

module.exports = protect;
