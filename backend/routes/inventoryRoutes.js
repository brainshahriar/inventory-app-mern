const express = require("express");
const authmiddleware = require("../middlewares/authmiddleware");
const { inventoryAdd, inventoryGet } = require("../controller/inventoryController");
const router = express.Router();

router.post("/create-inventory", authmiddleware, inventoryAdd);
router.get("/get-inventory", authmiddleware, inventoryGet);

module.exports = router;
