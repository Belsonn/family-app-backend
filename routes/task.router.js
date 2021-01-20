const express = require("express");
const authController = require("./../controllers/authController");
const taskController = require("./../controllers/taskController");
const router = express.Router();

router.use(authController.protect);

router.post("/addTask", taskController.addTask);
router.get("/", taskController.getTasks);

module.exports = router;
