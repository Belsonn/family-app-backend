const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: String,
  color: String,
  points: Number,
  users: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FamilyUser",
      },
      completed: {
        type: Boolean,
        default: false,
      },
      completedAt: {
        type: Date,
        default: null,
      },
      abandoned:{
        type: Boolean,
        default: false
      }
    },
  ],
  startDate: Date,
  endDate: Date,
  dailyTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DailyTask",
  },
});

taskSchema.pre(/^find/, function (next) {
  this.select("-__v");
  this.populate({
    path: "users",
    select: "-_id",
    populate: {
      path: "user",
      select: "-__v -password -family -dateOfBirth",
    },
  });

  next();
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
