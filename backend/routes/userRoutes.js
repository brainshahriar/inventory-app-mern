const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  myProfile,
  loginStatus,
  updateUser,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/my-profile", protect, myProfile);
router.get("/login-status", loginStatus);
router.post("/update-user", protect, updateUser);

module.exports = router;
