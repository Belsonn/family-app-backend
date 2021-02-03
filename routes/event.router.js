const express = require("express");
const authController = require("./../controllers/authController");
const eventController = require("./../controllers/eventController");
const router = express.Router();

router.use(authController.protect);

router.post("/addEvent", eventController.addEvent);
router
  .route("/event/:id")
  .all(eventController.checkIfEventExistsAndAllow)
  .get(eventController.getEvent)
  .patch(eventController.updateEvent)
  .delete(eventController.deleteEvent);

router.get("/", eventController.getEvents);

module.exports = router;
