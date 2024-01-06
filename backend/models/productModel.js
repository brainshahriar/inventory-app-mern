const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    name: {
      name: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    sku: {
      name: String,
      required: true,
      trim: true,
    },
    category: {
      name: String,
      required: [true, "Please add a category"],
      trim: true,
    },
    quantity: {
      name: String,
      required: [true, "Please add a quantity"],
      trim: true,
    },
    price: {
      name: String,
      required: [true, "Please add a price"],
      trim: true,
    },
    description: {
      name: String,
      required: [true, "Please add a description"],
      trim: true,
    },
    image: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
