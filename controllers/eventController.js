const globalError = require("./../utils/globalError");
const Event = require("./../models/event.model");
const Family = require("./../models/family.model");
const mongoose = require("mongoose");


exports.checkIfEventExistsAndAllow = async (req, res, next) => {
  let allow = false;

  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new globalError("This is not valid ID", 400));
  }

  const event = await Event.findOne({ _id: req.params.id }).populate("events");

  const family = await Family.findById(req.family._id).populate("events");

  if (!event || !family.events) {
    return next(new globalError("This event does not exists", 404));
  }
  family.events.forEach((el) => {
    el._id == req.params.id ? (allow = true) : null;
  });

  if (!allow) {
    return next(new globalError("You are not allowed to do that", 401));
  }
  next();
};

exports.addEvent = async (req, res, next) => {
  const event = await Event.create(req.body);

  family = await Family.findByIdAndUpdate(
    req.family._id,
    {
      $push: { events: event._id },
    },
    { new: true }
  ).populate("events");

  res.status(200).json({
    status: "success",
    data: {
      events: family.events,
    },
  });
};

exports.getEvents = async (req, res, next) => {
  const family = await Family.findById(req.family._id).populate("events");

  let events = family.events;

  events.sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  res.status(200).json({
    status: "success",
    results: family.events.length,
    data: {
      events,
    },
  });
};

exports.getEvent = async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      event,
    },
  });
};

exports.updateEvent = async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });

  res.status(200).json({
    status: "success",
    data: {
      event,
    },
  });
};

exports.deleteEvent = async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  const family = await Family.findByIdAndUpdate(req.family._id, {
    $pull: { events: req.params.id },
  });

  res.status(204).json({
    status: "success",
    data: null
  })
};
