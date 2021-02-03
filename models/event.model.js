const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: String,
  startDate: Date,
  endDate: Date,
});

eventSchema.pre(/^find/, function (next) {
  this.select("-__v");
  this.populate({
    path: "users",
    select: "-__v -password -family",
  });
  next();
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
