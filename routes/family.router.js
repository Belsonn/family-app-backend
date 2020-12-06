const express = require("express");
const authController = require("./../controllers/authController");
const familyController = require("./../controllers/familyController");
const router = express.Router();

// router.use(authController.protect);

router.post("/create", familyController.createFamily);
router.post("/nouser/create", familyController.createFamilyNoUser);
router.post("/join", familyController.joinFamily);

router.get("/:id", familyController.getFamily);
router.get("/code/:code", familyController.checkInviteCode);
router.post("/:family/addEvent", familyController.addEvent);
router.get("/:family/events", familyController.getEvents);
router.get("/:family/:familyuser", familyController.getMeAndFamily)

router.get("/", familyController.getAllFamilies);

module.exports = router;
