const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: [true, "User must provide an email."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Provide a valid email."],
  },
  password: {
    type: String,
    required: [true, "User must provide a password."],
    minlength: 6,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "User must confirm password"],
    validate: {
      validator: function (pass) {
        return pass === this.password;
      },
      message: "Passwords must be the same",
    },
  },
  active: {
    type: Boolean,
    default: false,
  },
  activationToken: String,
});

// userSchema.pre(/^find/, function (next) {
//   this.select("-__v");
//   next();
// });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};


const User = mongoose.model("User", userSchema);

module.exports = User;
