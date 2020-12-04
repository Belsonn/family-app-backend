const mongoose = require("mongoose");
const crypto = require("crypto");

const familySchema = new mongoose.Schema({
  name: String,
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FamilyUser",
    },
  ],
  inviteToken: {
    type: String,
    uppercase: true,
  },
  createdAt: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FamilyUser",
  },
});

familySchema.pre(/^find/, function (next) {
    this.select("-__v");
    this.populate({
      path: "users",
      select: "-__v -email -active",
    });
    next();
  });

familySchema.pre("save", function (next) {
  if (this.isNew) {
    this.createdAt = Date.now();
    this.inviteToken = crypto.randomBytes(3).toString("hex");
  }
  next();
});

const Family = mongoose.model("Family", familySchema);

module.exports = Family;
