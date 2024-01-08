const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

//create contact us
const createContact = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;
  const user = await userModel.findById(req.user._id);
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }
  if (!subject || !message) {
    res.status(400);
    throw new Error("Please enter all data");
  }
  const sent_to = process.env.EMAIL_USER;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = user.email;
  try {
    await sendEmail(subject, message, sent_to, sent_from, reply_to);
    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent , please try again");
  }
});

module.exports = {
  createContact,
};
