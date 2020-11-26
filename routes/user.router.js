const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.use(authController.protect);

router.route("/me").get(userController.getMe, userController.getUser);
router.route("/:id").get(userController.getUser);

module.exports = router;
