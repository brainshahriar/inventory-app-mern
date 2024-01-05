const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

//generate the token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

//register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await userModel.findOne({ email });
  //validation
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }
  if (!name || !email || !password) {
    res.status(404);
    throw new Error("Fill all required fields");
  }
  if (password.length < 6) {
    res.status(404);
    throw new Error("Password must be at least 6 characters");
  } else {
    //rest data
    const user = new userModel(req.body);
    //generate token
    const token = generateToken(user._id);
    //send hhtp-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 864000), // 1 day
      sameSite: "none",
      secure: true,
    });

    await user.save();
    return res.status(201).send({
      success: true,
      message: "User successfully registered",
      token,
      user,
    });
  }
});
//login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!email || !password) {
    res.status(400);
    throw new Error("Requird authentication");
  }
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  //validation with compare password
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    return res.status(500).send({
      success: false,
      message: "Password is incorrect",
    });
  }
  //generate token
  const token = generateToken(user._id);
  //send hhtp-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 864000), // 1 day
    sameSite: "none",
    secure: true,
  });
  return res.status(200).send({
    success: true,
    message: `Welcome ${user.name}`,
    token,
    user,
  });
});
// logout user
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), // 1 day
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({
    message: "User logged out successfully",
  });
});
//get user profile
const myProfile = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id);
  if (user) {
    res.status(200).json({
      user,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
//login status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  //verify token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});
// update profile
const updateUser = asyncHandler(async (req, res) => {
  
  const user = await userModel.findById(req.user._id);
  if (user) {
    const { name, email, photo, phone, bio } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo || photo;

    const updatedUser = await user.save();
    res.status(200).json({
      updatedUser,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  myProfile,
  loginStatus,
  updateUser,
};
