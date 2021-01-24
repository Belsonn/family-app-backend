const DailyTask = require("./../models/dailyTask.model");
const Family = require("./../models/family.model");
const Task = require("./../models/task.model");
const globalError = require("./../utils/globalError");

exports.createDailyTask = async (req, res, next) => {
  const dailyTask = await DailyTask.create(req.body);

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

exports.getDailyTasks = async (req, res, next) => {
  const family = await Family.findById(req.family._id).populate("dailyTasks");

  let dailyTasks = family.dailyTasks;

  dailyTasks.sort((a, b) => {
    if(parseInt(a.startTime.split(":")[0]) !== parseInt(b.startTime.split(":")[0])){
      return parseInt(a.startTime.split(":")[0]) - parseInt(b.startTime.split(":")[0]);
    } else {
      return parseInt(a.startTime.split(":")[1]) - parseInt(b.startTime.split(":")[1]);
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
    const newTask = await Task.create(task);

    family = await Family.findByIdAndUpdate(
      req.family._id,
      { $push: { tasks: newTask._id } },
      { new: true }
    );
  });

  res.status(200).json({
    status: "success",
    data: {
      tasks: newTasks,
    },
  });
};
