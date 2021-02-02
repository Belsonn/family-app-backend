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
  )
  .delete(
    rewardController.checkIfRewardExistsAndAllow,
    rewardController.deleteReward
  );

router.get("/basic", rewardController.getRewardsBasic);
router.get("/unlocked", rewardController.getRewardsUnlocked);
router.get("/my", rewardController.getMyRewards);
router.post("/createReward", rewardController.createReward);
router.post("/unlock", rewardController.unlockReward);

module.exports = router;
