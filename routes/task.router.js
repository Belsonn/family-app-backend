const express = require("express");
const authController = require("./../controllers/authController");
const taskController = require("./../controllers/taskController");
const dailyTaskController = require("./../controllers/dailyTaskController");
const router = express.Router();

router.use(authController.protect);

router.post("/addTask", taskController.addTask);
router.patch("/setTaskStatus", taskController.setTaskStatus);

router.post("/addDailyTask", dailyTaskController.createDailyTask);
router.post("/updateDailyTasks", dailyTaskController.updateDailyTask);
router.get("/dailyWithTask", dailyTaskController.taskOnDate);
router.get(
  "/daily/:id",
  dailyTaskController.checkIfDailyTaskExistsAndAllow,
  dailyTaskController.getSingleDailyTask
);
router.patch(
  "/daily/:id",
  dailyTaskController.checkIfDailyTaskExistsAndAllow,
  dailyTaskController.editDailyTaskData
);
router.get("/daily", dailyTaskController.getDailyTasks);

router.get("/", taskController.getTasks);

module.exports = router;
