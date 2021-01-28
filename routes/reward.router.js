const express = require("express");
const authController = require("./../controllers/authController");
const rewardController = require("./../controllers/rewardController");
const router = express.Router();

router.use(authController.protect);

router
  .route("/reward/:id")
  .get(rewardController.checkIfRewardExistsAndAllow, rewardController.getReward)
  .patch(
    rewardController.checkIfRewardExistsAndAllow,
    rewardController.updateReward
  );

router.get("/basic", rewardController.getRewardsBasic);
router.get("/unlocked", rewardController.getRewardsUnlocked);
router.post("/createReward", rewardController.createReward);

module.exports = router;
