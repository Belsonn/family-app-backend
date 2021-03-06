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
  let rewardsUnlockedAndConfirmed = [];

  if (allRewards) {
    for (let i = 0; i < allRewards.length; i++) {
      if (allRewards[i].unlockedBy && allRewards[i].confirmed) {
        rewardsUnlockedAndConfirmed.push(allRewards[i]);
      } else if (allRewards[i].unlockedBy) {
        rewardsUnlocked.push(allRewards[i]);
      }
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      rewardsUnlocked: rewardsUnlocked,
      rewardsConfirmed: rewardsUnlockedAndConfirmed,
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

exports.unlockReward = async (req, res, next) => {
  const reward = await Reward.create(req.body);

  const family = await Family.findByIdAndUpdate(req.family._id, {
    $push: { rewards: reward._id },
  });

  let familyUser = await FamilyUser.findById(req.familyUser._id);

  familyUser = await FamilyUser.findByIdAndUpdate(req.familyUser._id, {
    points: familyUser.points - reward.points,
  });

  res.status(200).json({
    status: "success",
    data: {
      reward,
    },
  });
};

exports.getMyRewards = async (req, res, next) => {
  let rewards = await Reward.find({
    unlockedBy: { _id: req.familyUser._id },
  });

  let rewardsPending = [];
  let rewardsApproved = [];

  if (rewards.length > 0) {
    for (let i = 0; i < rewards.length; i++) {
      if (rewards[i].confirmed) {
        rewardsApproved.push(rewards[i]);
      } else {
        rewardsPending.push(rewards[i]);
      }
    }
    rewardsApproved.sort((a, b) => b.unlockedAt - a.unlockedAt);
    rewardsPending.sort((a, b) => b.unlockedAt - a.unlockedAt);

    rewards = [...rewardsPending, ...rewardsApproved];
  }

  res.status(200).json({
    status: "success",
    data: {
      rewards,
    },
  });
};

exports.deleteReward = async (req, res, next) => {
  const id = req.params.id;

  const reward = await Reward.findByIdAndDelete(id);

  const family = await Family.findByIdAndUpdate(req.family._id, {
    $pull: { rewards: id },
  });

  res.status(204).json({
    status: "success",
    data: {},
  });
};
