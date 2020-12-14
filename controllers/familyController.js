const globalError = require("./../utils/globalError");
const Family = require("./../models/family.model");
const authController = require("./authController");
const User = require("./../models/user.model");
const FamilyUser = require("./../models/familyuser.model");

exports.createFamily = async (req, res, next) => {
  const family = await Family.create({
    name: req.body.name,
    users: [req.user.id],
    createdBy: req.user.id,
  });

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { family: family.id },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    data: {
      family,
    },
  });
};

exports.createFamilyNoUser = async (req, res, next) => {
  let familyUser = await FamilyUser.create({
    name: req.body.username,
    gender: req.body.gender,
    dateOfBirth: req.body.dateOfBirth,
    role: req.body.role,
    photo: setDefaultPhoto(req, req.body.role, req.body.gender),
    password: req.body.password,
  });

  if (!familyUser.id) {
    return next(new globalError("Something went wrong, 500"));
  }

  const family = await Family.create({
    name: req.body.familyname,
    users: [familyUser.id],
    createdBy: familyUser.id,
  });

  familyUser = await FamilyUser.findByIdAndUpdate(
    familyUser.id,
    { family: family.id },
    { new: true }
  );

  authController.createSendToken(familyUser, 200, res);
};

const setDefaultPhoto = (req, role, gender) => {
  const url = req.protocol + "://" + req.get("host") + "/photos/users/";
  if (role == "parent" && gender == "male") {
    return url + "defaultMen.jpg";
  } else if (role == "parent" && gender == "female") {
    return url + "defaultWomen.jpg";
  } else if (role == "child" && gender == "male") {
    return url + "defaultMenChild.jpg";
  } else if (role == "child" && gender == "female") {
    return url + "defaultWomanChild.jpg";
  }
  return null;
};

exports.joinFamily = async (req, res, next) => {
  let familyUser = await FamilyUser.create({
    name: req.body.username,
    gender: req.body.gender,
    role: req.body.role,
    dateOfBirth: req.body.dateOfBirth,
    password: req.body.password,
    photo: setDefaultPhoto(req, req.body.role, req.body.gender),
    family: req.body.familyid,
  });

  family = await Family.findByIdAndUpdate(
    req.body.familyid,
    { $push: { users: familyUser.id } },
    { new: true }
  );

  authController.createSendToken(familyUser, 200, res);
};

exports.checkInviteCode = async (req, res, next) => {
  const code = req.params.code;

  const family = await Family.findOne({ inviteToken: code });

  let exists;
  family ? (exists = true) : (exists = false);

  if (family) {
    res.status(200).json({
      status: "success",
      data: {
        familyId: family._id,
        exists: exists,
      },
    });
  } else {
    res.status(200).json({
      status: "success",
      data: {
        exists: exists,
      },
    });
  }
};

exports.getFamily = async (req, res, next) => {
  const family = await Family.findById(req.params.id);

  if (!family) {
    return next(new globalError("There are no families with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      family,
    },
  });
};

exports.getAllFamilies = async (req, res, next) => {
  const families = await Family.find();

  if (!families) {
    return next(new globalError("No families, 404"));
  }

  res.status(200).json({
    status: "success",
    results: families.length,
    data: {
      families,
    },
  });
};

exports.getMeAndFamily = async (req, res, next) => {
  const familyUser = await FamilyUser.findById(req.familyUser.id);
  const family = await Family.findById(req.family);

  if (!family || !familyUser) {
    return next(
      new globalError("There is no user or family with provided id", 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      familyUser,
      family,
    },
  });
};

exports.addEvent = async (req, res, next) => {
  const event = {
    name: req.body.name,
    color: req.body.color,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    allDay: req.body.allDay,
    repeat: null,
  };

  if (req.body.repeat) {
    event.repeat = {
      repeatType: req.body.repeat.repeatType,
      repeatEvery: req.body.repeat.repeatEvery,
    };
  }

  let family = await Family.findById(req.family._id);

  if (!family) {
    return next(new globalError("Wrong id provided", 400));
  }

  family = await Family.findByIdAndUpdate(
    req.family._id,
    {
      $push: { events: event },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      family
    },
  });
};

exports.getEvents = async (req, res, next) => {
  const family = await Family.findById(req.family._id);

  if (!family) {
    return next(new globalError("There is no familyID", 404));
  }

  res.status(200).json({
    status: "success",
    results: family.events.length,
    data: {
      family
    },
  });
};

exports.addGrocery = async (req, res, next) => {
  let family = await Family.findById(req.family._id);

  if (!family) {
    return next(new globalError("There is no familyID", 404));
  }
  const grocery = {
    item: {
      name: req.body.name,
      quantity: req.body.quantity,
      details: req.body.details,
    },
    completedAt: null,
  };

  family = await Family.findByIdAndUpdate(
    req.family._id,
    {
      $push: { groceries: grocery },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      family
    }
  })
};
