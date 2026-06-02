const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      //  Normalise to lowercase so "User@Email.com" and "user@email.com" are treated identically
      lowercase: true,
      trim: true,
    },
    // We store the bcrypt hash, NEVER the plain-text password
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

module.exports = User
