const globalError = require("./../utils/globalError");
const Event = require("./../models/event.model");
const Family = require("./../models/family.model");

exports.addEvent = async (req, res, next) => {
  //   const event = {
  //     name: req.body.name,
  //     color: req.body.color,
  //     eventType: req.body.type,
  //     users: req.body.users,
  //     startDate: req.body.startDate,
  //     endDate: req.body.endDate,
  //     allDay: req.body.allDay,
  //     repeatType: req.body.repeatType,
  //     repeatEvery: req.body.repeatEvery,
  //   };

  const event = await Event.create(req.body);

  family = await Family.findByIdAndUpdate(
    req.family._id,
    {
      $push: { events: event._id },
    },
    { new: true }
  ).select("+events")

  res.status(200).json({
    status: "success",
    data: {
      events: family.events,
    },
  });
};

exports.getEvents = async (req, res, next) => {
  const family = await Family.findById(req.family._id).select("+events")

  if (!family) {
    return next(new globalError("There is no familyID", 404));
  }

  let events = family.events;

  console.log(family.events.length)

  
  res.status(200).json({
    status: "success",
    results: family.events.length,
    data: {
      events: family.events
    },
  });
};
