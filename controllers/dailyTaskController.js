const DailyTask = require("./../models/dailyTask.model");
const Family = require("./../models/family.model");
const Task = require("./../models/task.model");
const globalError = require("./../utils/globalError");
const mongoose = require("mongoose");

exports.createDailyTask = async (req, res, next) => {
  const dailyTask = await DailyTask.create(req.body);

  if (!req.body) {
    return next(new globalError("No dailyTask send to server.", 400));
  }

  const family = await Family.findByIdAndUpdate(
    req.family._id,
    {
      $push: { dailyTasks: dailyTask._id },
    },
    { new: true }
  ).populate("dailyTasks");

  res.status(200).json({
    status: "success",
    results: family.dailyTasks.length,
    data: {
      dailyTasks: family.dailyTasks,
    },
  });
};

exports.checkIfDailyTaskExistsAndAllow = async (req, res, next) => {
  let allow = false;

  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new globalError("This is not valid ID", 400));
  }

  const list = await DailyTask.findOne({ _id: req.params.id });

  const family = await Family.findById(req.family._id).populate("dailyTasks");

  if (!list) {
    return next(new globalError("This list does not exists", 404));
  }
  family.dailyTasks.forEach((el) => {
    el._id == req.params.id ? (allow = true) : null;
  });

  if (!allow) {
    return next(new globalError("You are not allowed to do that", 401));
  }
  next();
};

exports.getSingleDailyTask = async (req, res, next) => {

  const dailyTask = await DailyTask.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      dailyTask,
    },
  });
};

exports.getDailyTasks = async (req, res, next) => {
  const family = await Family.findById(req.family._id).populate("dailyTasks");

  let dailyTasks = family.dailyTasks;

  
  // Sorting by date

  dailyTasks.sort((a, b) => {
    if (
      parseInt(a.startTime.split(":")[0]) !==
      parseInt(b.startTime.split(":")[0])
    ) {
      return (
        parseInt(a.startTime.split(":")[0]) -
        parseInt(b.startTime.split(":")[0])
      );
    } else {
      return (
        parseInt(a.startTime.split(":")[1]) -
        parseInt(b.startTime.split(":")[1])
      );
    }
  });

  res.status(200).json({
    status: "success",
    results: family.dailyTasks.length,
    data: {
      dailyTasks,
    },
  });
};

exports.taskOnDate = async (req, res, next) => {
  const date = new Date(req.query.date);

  const family = await Family.findById(req.family._id).populate("tasks");

  let allTasks = family.tasks;

  let tasks = [];

  allTasks.forEach((el) => {
    let dateLocal = new Date(el.startDate);

    if (
      el.dailyTask &&
      date.getDate() === dateLocal.getDate() &&
      date.getMonth() === dateLocal.getMonth() &&
      date.getFullYear() === dateLocal.getFullYear()
    ) {
      tasks.push(el);
    }
  });

  res.status(200).json({
    data: {
      tasks,
    },
  });
};

exports.editDailyTaskData = async (req, res, next) => {
  if (!req.params.id) {
    return next(new globalError("No id provided", 400));
  }

  const dailyTask = await DailyTask.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });


  // Update all tasks made with this daily task

  const tasks = await Task.find({ dailyTask: dailyTask.id });

  let task;

  for (let i = 0; i < tasks.length; i++) {
    let startHours = dailyTask.startTime.split(":");
    let endHours = dailyTask.endTime.split(":");

    task = await Task.findByIdAndUpdate(
      tasks[i].id,
      {
        name: dailyTask.name,
        points: dailyTask.points,
        startDate: new Date(tasks[i].startDate).setHours(
          startHours[0],
          startHours[1]
        ),
        endDate: new Date(tasks[i].startDate).setHours(
          endHours[0],
          endHours[1]
        ),
      },
      { new: true }
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      dailyTask,
    },
  });
};

exports.updateDailyTask = async (req, res, next) => {
  if (!req.query.date) {
    return next(new globalError("No date provided", 400));
  }
  if (!req.body.tasks) {
    return next(new globalError("No tasks provided", 400));
  }

  const date = new Date(req.query.date);

  const newTasks = req.body.tasks;

  // delete tasks on date

  let family = await Family.findById(req.family._id).populate("tasks");

  allTasks = family.tasks;

  let tasks = [];

  allTasks.forEach((el) => {
    let dateLocal = new Date(el.startDate);

    if (
      el.dailyTask &&
      date.getDate() === dateLocal.getDate() &&
      date.getMonth() === dateLocal.getMonth() &&
      date.getFullYear() === dateLocal.getFullYear()
    ) {
      tasks.push(el);
    }
  });

  tasks.forEach(async (el) => {
    family = await Family.findByIdAndUpdate(
      req.family._id,
      {
        $pull: { tasks: el._id },
      },
      { new: true }
    );

    let task = await Task.findByIdAndDelete(el._id);
  });

  // add new tasks

  newTasks.forEach(async (task) => {
    if (!task.users.length < 1) {
      const newTask = await Task.create(task);

      family = await Family.findByIdAndUpdate(
        req.family._id,
        { $push: { tasks: newTask._id } },
        { new: true }
      );
    }
  });

  family = await Family.findById(req.family._id).populate("tasks");

  res.status(200).json({
    status: "success",
    data: {
      tasks: family.tasks,
    },
  });
};
