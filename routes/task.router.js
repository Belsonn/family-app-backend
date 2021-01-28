const express = require("express");
const authController = require("./../controllers/authController");
const taskController = require("./../controllers/taskController");
const dailyTaskController = require("./../controllers/dailyTaskController");
const router = express.Router();

router.use(authController.protect);

router.get(
  "/task/:id",
  taskController.checkIfTaskExistsAndAllow,
  taskController.getSingleTask
);
router.patch(
  "/task/:id",
  taskController.checkIfTaskExistsAndAllow,
  taskController.editSingleTask
);
router.post("/addTask", taskController.addTask);
router.patch("/setTaskStatus", taskController.setTaskStatus);

// DAILY TASKS

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
router.delete(
  "/daily/:id",
  dailyTaskController.checkIfDailyTaskExistsAndAllow,
  dailyTaskController.deleteDailyTask
);
router.get("/daily", dailyTaskController.getDailyTasks);

router.get("/", taskController.getTasks);

module.exports = router;
