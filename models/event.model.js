const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: String,
  color: String,
  startDate: Date,
  endDate: Date,
  allDay: Boolean,
  repeatType: String,
  repeatEvery: String,
});

eventSchema.pre(/^find/, function (next) {
    this.select("-__v");
    this.populate({
      path: "users",
      select: "-__v -password",
    });
    next();
  });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
