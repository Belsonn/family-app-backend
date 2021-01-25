const Task = require("./../models/task.model");
const Family = require("./../models/family.model");
const FamilyUser = require("./../models/familyuser.model");

exports.addTask = async (req, res, next) => {
  const task = await Task.create(req.body);

  const family = await Family.findByIdAndUpdate(
    req.family._id,
    {
      $push: { tasks: task._id },
    },
    { new: true }
  ).populate("tasks");

  res.status(200).json({
    status: "success",
    results: family.tasks.length,
    data: {
      tasks: family.tasks,
    },
  });
};

exports.getTasks = async (req, res, next) => {
  const family = await Family.findById(req.family._id).populate("tasks");

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

exports.setTaskStatus = async (req, res, next) => {
  for (let i = 0; i < req.body.task.users.length; i++) {
    req.body.task.users[i].user = req.body.task.users[i].user._id;
  }

  const task = await Task.findByIdAndUpdate(
    req.body.task._id,
    { users: req.body.task.users },
    {
      new: true,
    }
  );

  const familyUser = await FamilyUser.findByIdAndUpdate(req.familyUser, {
    points: req.body.points,
  });

  const family = await Family.findById(req.family._id).populate("tasks");

  res.status(200).json({
    status: "success",
    data: {
      tasks: family.tasks,
    },
  });
};
