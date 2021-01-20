const globalError = require("./../utils/globalError");
const Task = require("./../models/task.model");
const Family = require("./../models/family.model");

exports.addTask = async (req, res, next) => {
  const task = await Task.create(req.body);

  const family = await Family.findByIdAndUpdate(
    req.family._id,
    {
      $push: { tasks: task._id },
    },
    { new: true }
  ).select("+tasks");

  res.status(200).json({
    status: "success",
    results: family.tasks.length,
    data: {
      tasks: family.tasks,
    },
  });
};

exports.getTasks = async (req, res, next) => {
  const family = await Family.findById(req.family._id).select("+tasks");

  let tasks = family.tasks;

  tasks.sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  res.status(200).json({
    status: "success",
    results: family.tasks.length,
    data: {
      tasks,
    },
  });
};
