const Reward = require("./../models/reward.model");
const Family = require("./../models/family.model");
const FamilyUser = require("./../models/familyuser.model");
const globalError = require("./../utils/globalError");

const mongoose = require("mongoose");

exports.checkIfRewardExistsAndAllow = async (req, res, next) => {
  let allow = false;

  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new globalError("This is not valid ID", 404));
  }

  const reward = await Reward.findOne({ _id: req.params.id });

  const family = await Family.findById(req.family._id).populate("rewards");

  if (!reward || !family.rewards) {
    return next(new globalError("This reward does not exists", 404));
  }
  family.rewards.forEach((el) => {
    el._id == req.params.id ? (allow = true) : null;
  });

  if (!allow) {
    return next(new globalError("You are not allowed to do that", 401));
  }
  next();
};

exports.getReward = async (req, res, next) => {
  const reward = await Reward.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      reward,
    },
  });
};

exports.getRewardsBasic = async (req, res, next) => {
  const family = await Family.findById(req.family._id).populate("rewards");

  const allRewards = family.rewards;

  let basicRewards = [];

  if (allRewards) {
    for (let i = 0; i < allRewards.length; i++) {
      if (!allRewards[i].unlockedBy) {
        basicRewards.push(allRewards[i]);
      }
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      rewards: basicRewards,
    },
  });
};

exports.getRewardsUnlocked = async (req, res, next) => {
  const family = await Family.findById(req.family._id).populate("rewards");

  const allRewards = family.rewards;

  let rewardsUnlocked = [];

  if (allRewards) {
    for (let i = 0; i < allRewards.length; i++) {
      if (allRewards[i].unlockedBy) {
        rewardsUnlocked.push(allRewards[i]);
      }
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      rewards: rewardsUnlocked,
    },
  });
};

exports.createReward = async (req, res, next) => {
  const reward = await Reward.create(req.body);

  const family = await Family.findByIdAndUpdate(req.family._id, {
    $push: { rewards: reward._id },
  });

  res.status(200).json({
    status: "success",
    data: {
      reward,
    },
  });
};

exports.updateReward = async (req, res, next) => {
  const reward = await Reward.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    data: "success",
    data: {
      reward,
    },
  });
};
