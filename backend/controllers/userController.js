const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

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
    const token = generateToken(user._id);
    await user.save();
    return res.status(201).send({
      success: true,
      message: "User successfully registered",
      token,
      user
    });
  }
});
// //login
// const loginController = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await userModel.findOne({ email: email });
//     if (!user) {
//       return res.status(404).send({
//         success: false,
//         message: "User not found",
//       });
//     }
//     //role check
//     if(user.role !== req.body.role) {
//       return res.status(500).send({
//         success: false,
//         message: "Role does not match",
//       });
//     }
//     //validation with compare password
//     const comparePassword = await bcrypt.compare(password, user.password);
//     if (!comparePassword) {
//       return res.status(500).send({
//         success: false,
//         message: "Password is incorrect",
//       });
//     }
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });
//     return res.status(200).send({
//       success: true,
//       message: `Welcome ${user.role}`,
//       token,
//       user,
//     });
//   } catch (error) {
//     return res.status(500).send({
//       success: false,
//       message: "Error in login API",
//       error: error.message,
//     });
//   }
// };
// //current user get
// const currentUserController = async (req, res) => {
//   try {
//     const currentUser = await userModel.findOne({_id:req.body.userId});
//     return res.status(200).send({
//       success: true,
//       currentUser
//     })
//   } catch (error) {
//     return res.status(500).send({
//       success: false,
//       message: "Error in login API",
//       error: error.message
//     });
//   }
// };

module.exports = { registerUser };
