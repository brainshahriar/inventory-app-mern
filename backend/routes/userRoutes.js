const express = require("express");
const { registerUser } = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
// router.post("/login", loginController);
// router.get("/current-user", authmiddleware, currentUserController);

module.exports = router;
