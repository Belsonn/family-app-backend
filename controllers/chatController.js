const Family = require("./../models/family.model");
const FamilyUser = require("./../models/familyuser.model");

exports.getMessages = async (req, res, next) => {
  const family = await Family.findById(req.family._id).select("+messages");

  let messages = family.messages;

  messages.splice(0, messages.length - 20);

  res.status(200).json({
    status: "success",
    results: messages.length,
    data: {
      messages,
    },
  });
};

exports.getMoreMessages = async (req, res, next) => {
  const family = await Family.findById(req.family._id).select("+messages");

  messagesLoaded = req.params.messages;

  if (messagesLoaded >= family.messages.length) {
    res.status(200).json({
      status: "success",
      data: {
        messages: null,
      },
    });
  } else {
    let messages = family.messages;

    messages.splice(0, messages.length - 20 - messagesLoaded);

    if(messages.length - messagesLoaded < 20){
      messages.splice(messages.length - messagesLoaded, messagesLoaded)
    } else {
      messages.splice(20, messagesLoaded);
    }


    res.status(200).json({
      status: "success",
      results: messages.length,
      data: {
        messages,
      },
    });
  }
};

exports.getAllMessages = async (req, res, next) => {
  const family = await Family.findById(req.family._id).select("+messages");

  res.status(200).json({
    status: "success",
    results: family.messages.length,
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
