const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  myProfile,
  loginStatus,
  updateUser,
  changePassword,
  resetPassword,
  forgotPassword
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/my-profile", protect, myProfile);
router.get("/login-status", loginStatus);
router.post("/update-user", protect, updateUser);
router.post("/change-password", protect, changePassword);
router.post("/reset-password", protect, resetPassword);
router.post("/forgot-password/:resetToken", protect, forgotPassword);

module.exports = router;
