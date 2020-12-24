const Family = require("./../models/family.model");
const FamilyUser = require("./../models/familyuser.model");

exports.getMessages = async (req, res, next) => {
  const family = await Family.findById(req.family._id);

  const messages = family.messages;

  res.status(200).json({
    status: "success",
    data: {
      messages: family.messages,
    },
  });
};

exports.addMessage = async (req, res, next) => {
  let message = {
    date: new Date(),
    message: req.body.message,
    createdBy: req.familyUser,
  };

  req.app.io.emit("new-message", message);

  message.createdBy = req.familyUser._id;
  
  const family = await Family.findByIdAndUpdate(
    req.family._id,
    {
      $push: { messages: message },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      message,
    },
  });
};
