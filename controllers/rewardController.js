const Reward = require("./../models/reward.model");
const Family = require("./../models/family.model");
const FamilyUser = require("./../models/familyuser.model");
const globalError = require("./../utils/globalError");

const mongoose = require("mongoose");

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
