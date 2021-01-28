const express = require("express");
const authController = require("./../controllers/authController");
const taskController = require("./../controllers/taskController");
const dailyTaskController = require("./../controllers/dailyTaskController");
const router = express.Router();

router.use(authController.protect);

router
  .route("/task/:id")
  .get(taskController.checkIfTaskExistsAndAllow, taskController.getSingleTask)
  .patch(
    taskController.checkIfTaskExistsAndAllow,
    taskController.editSingleTask
  )
  .delete(taskController.checkIfTaskExistsAndAllow, taskController.deleteTask);

router.post("/addTask", taskController.addTask);
router.patch("/setTaskStatus", taskController.setTaskStatus);

// DAILY TASKS

router.post("/addDailyTask", dailyTaskController.createDailyTask);
router.post("/updateDailyTasks", dailyTaskController.updateDailyTask);
router.get("/dailyWithTask", dailyTaskController.taskOnDate);

router
  .route("/daily/:id")
  .get(
    dailyTaskController.checkIfDailyTaskExistsAndAllow,
    dailyTaskController.getSingleDailyTask
  )
  .patch(
    dailyTaskController.checkIfDailyTaskExistsAndAllow,
    dailyTaskController.editDailyTaskData
  )
  .delete(
    dailyTaskController.checkIfDailyTaskExistsAndAllow,
    dailyTaskController.deleteDailyTask
  );
router.get("/daily", dailyTaskController.getDailyTasks);

router.get("/", taskController.getTasks);

module.exports = router;
