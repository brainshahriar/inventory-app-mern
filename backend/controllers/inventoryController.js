const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

const inventoryAdd = async (req, res) => {
  const { email, inventoryType } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    if (inventoryType === "in" && user.role !== "donor") {
      return res.status(404).send({
        success: false,
        message: "Not a donor account",
      });
    }
    if (inventoryType === "out" && user.role !== "hospital") {
      return res.status(404).send({
        success: false,
        message: "Not a hospital account",
      });
    } else {
      const inventory = new inventoryModel(req.body);
      await inventory.save();
      return res.status(201).send({
        success: true,
        message: "Inventory added",
        inventory,
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in inventory add API",
      error: error,
    });
  }
};

const inventoryGet = async (req, res) => {
  try {
    const inventory = await inventoryModel.find({ organisation: req.body.userId })
    .populate('donor')
    .populate('hospital')
    .sort({createdAt:-1});
    return res.status(200).send({
      success: true,
      message: "All inventory",
      inventory,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in inventory get API",
      error: error,
    });
  }
};

module.exports = { inventoryAdd, inventoryGet };
