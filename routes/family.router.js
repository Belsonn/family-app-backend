const express = require("express");
const authController = require("./../controllers/authController");
const familyController = require("./../controllers/familyController");
const router = express.Router();

// router.use(authController.protect);

router.post("/create", familyController.createFamily);
router.post("/nouser/create", familyController.createFamilyNoUser);
router.post("/join", familyController.joinFamily);
router.get("/all", familyController.getAllFamilies);

router.get("/code/:code", familyController.checkInviteCode);
router.get("/family/:id", familyController.getFamily);

router.use(authController.protect);
router.get("/myFamily", familyController.getMeAndFamily)
router.get("/settings", familyController.getSettings)

module.exports = router;
