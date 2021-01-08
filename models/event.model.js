const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: String,
  color: String,
  eventType: {
    type: String,
    enum: ["event", "task"],
  },
  users:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "FamilyUser",
  }],
  startDate: Date,
  endDate: Date,
  allDay: Boolean,
  repeatType: String,
  repeatEvery: Number,
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
