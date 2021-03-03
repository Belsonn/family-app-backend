const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: String,
  startDate: Date,
  endDate: Date,
});


const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
