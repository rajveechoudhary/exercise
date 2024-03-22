const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide user name."],
  },
  email: {
    type: String,
    required: [true, "Please provide user email."],
    unique: [true, "Email already exist."],
  },
  contact: {
    type: String,
    required: [true, "Please provide user contact number."],
    unique: [true, "Contact number already exist."],
  },
  password: {
    type: String,
  },
  dob: {
    type: Date,
  },
  gender: {
    type: String,
  },
  weight: {
    type: String,
  },
  height: {
    type: String,
  },
  role: {
    type: String,
    default: "User",
  },
  activeToken: {
    type: String,
  },
  profile: {
    type: String,
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
