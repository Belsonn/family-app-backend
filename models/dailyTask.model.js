const mongoose = require("mongoose");

const dailyTaskSchema = new mongoose.Schema({
  name: String,
  points: Number,
  startTime: String,
  endTime: String,
});

dailyTaskSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});

const DailyTask = mongoose.model("DailyTask", dailyTaskSchema);

module.exports = DailyTask;
