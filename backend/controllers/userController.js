const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const tokenModel = require("../models/tokenModel");
const sendEmail = require("../utils/sendEmail");

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
// change password
const changePassword = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id);
  const { oldPassword, newPassword } = req.body;

  //validate
  if (!user) {
    res.status(404);
    throw new Error("User not found, please try again");
  }
  if (!oldPassword || !newPassword) {
    res.status(403);
    throw new Error("All fields are required");
  }
  //check password
  const comparePassword = await bcrypt.compare(oldPassword, user.password);
  //save password
  if (user && comparePassword) {
    user.password = newPassword;
    await user.save();
    res.status(200).send("Password changed successfully");
  } else {
    res.status(400);
    throw new Error("Old password is incorrect");
  }
});
// reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("Please enter your email address");
  }
  //delete token if it exist in DB
  let token = await tokenModel.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }
  //create reset token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(resetToken);
  //Hash token before saving to db
  const hashToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //save
  await new tokenModel({
    userId: user._id,
    token: hashToken,
    createdAt: Date.now(),
    expiredAt: Date.now() + 30 * (60 * 1000), //thirty minutes
  }).save();
  //construct reset url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  //Reset Email

  const message = `
    <h2>Hello ${user.name}</h2>
    <p>Please use the url below</p>
    <p>This reset link is valid for only 30 minutes</p>

    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

    <p>Regards....</p>
    <p>SHAHRIAR TEAM</p>
`;
  const subject = "Password Reset Request";
  const sent_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, sent_to, sent_from);
    res.status(200).json({
      success: true,
      message: "Reset Link Sent Successfully",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent , please try again");
  }
});
// forgot password
const forgotPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  //hash token and compare to token in DB
  const hashToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //find token in DB
  const userToken = await tokenModel.findOne({
    token: hashToken,
    expiredAt: { $gt: Date.now() },
  });
  if(!userToken) {
    res.status(401);
    throw new Error("Expired or Invalid token");
  }
  //Find User
  const user = await userModel.findOne({_id:userToken.userId})
  user.password = password
  await user.save()
  res.status(200).json({
    message: "Password reset successfully"
  })
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  myProfile,
  loginStatus,
  updateUser,
  changePassword,
  resetPassword,
  forgotPassword,
};
