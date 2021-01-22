const DailyTask = require("./../models/dailyTask.model");
const Family = require("./../models/family.model");

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

  console.log(date);

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

exports.createMultipleTask = async (req, res, next) => {};
