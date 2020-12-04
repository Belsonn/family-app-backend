const express = require("express");
const familyUserController = require("./../controllers/familyUserController");
const router = express.Router();


router.route("/me").get(familyUserController.getMe, familyUserController.getUser);
router.route("/:id").get(familyUserController.getUser);

module.exports = router;
