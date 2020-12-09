const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const familyUserSchema = new mongoose.Schema({
  name: String,
  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Family",
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  role: {
    type: String,
    enum: ["parent", "child"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  password: {
    type: String,
    minlength: 6,
    select: false
  },
  dateOfBirth: Date,
  photo: String,
  points: Number,
});
familyUserSchema.pre(/^find/, function (next) {
  this.select("-__v");
  this.populate({
    path: "family",
    select: "-__v -users -createdAt -createdBy -events",
  });
  next();
});
familyUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

familyUserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};




const FamilyUser = mongoose.model("FamilyUser", familyUserSchema);

module.exports = FamilyUser;
