const express = require("express");
const familyUserController = require("./../controllers/familyUserController");
const authController = require("./../controllers/authController");
const router = express.Router();


// router.route("/me").get(familyUserController.getMe, familyUserController.getUser);
// router.route("/:id").get(familyUserController.getUser);
router.post("/login", authController.loginLocal);

module.exports = router;
