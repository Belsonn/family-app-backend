const express = require("express");
const authController = require("./../controllers/authController");
const eventController = require("./../controllers/eventController");
const router = express.Router();

router.use(authController.protect);

router.post("/addEvent", eventController.addEvent);
router.get("/", eventController.getEvents);

module.exports = router;
