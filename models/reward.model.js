const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  name: String,
  points: Number,
  unlockedBy : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FamilyUser"
  },
  unlockedAt: {
    type: Date,
  }
});

rewardSchema.pre(/^find/, function (next) {
  this.select("-__v");
  this.populate({
    path: "unlockedBy",
    select: "-__v -password -family",
  });
  next();
});

const Reward = mongoose.model("Reward", rewardSchema);

module.exports = Reward;
