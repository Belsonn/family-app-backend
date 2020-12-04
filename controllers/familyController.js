const globalError = require("./../utils/globalError");
const Family = require("./../models/family.model");
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
  const familyUser = await FamilyUser.create({
    name: req.body.username,
    gender: req.body.gender,
    role: req.body.role,
    password: req.body.password
  });
  if(!familyUser.id){
    return next(new globalError("Something went wrong, 500"));
  }

  const family = await Family.create({
    name: req.body.familyname,
    users: [familyUser.id],
    createdBy: familyUser.id
  })

  res.status(201).json({
    status: 'success',
    data: {
      family
    }
  })
}

exports.joinFamily = async (req, res, next) => {
  let user = await User.findById(req.user.id);

  if (user.family) {
    return next(new globalError("You already have a family"), 400);
  }
  let family = await Family.findOne({ inviteToken: req.body.inviteToken });

  if (!family) {
    return next(new globalError("There is no family with that token", 404));
  }
  if (family.users.find((el) => el == req.user.id)) {
    return next(new globalError("You joined this family already"), 400);
  }

  user = await User.findByIdAndUpdate(
    req.user.id,
    { family: family.id },
    { new: true }
  );

  family = await Family.findByIdAndUpdate(
    family.id,
    { $push: { users: user.id } },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      family,
    },
  });
};

exports.checkInviteCode = async (req, res, next) => {
  const code = req.params.code;

  const family = await Family.findOne({ inviteToken: code });

  let exists;
  family ? exists = true : exists = false;

  res.status(200).json({
    status: "success",
    data: {
      exists: exists
    }
  })

}

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
}

exports.getAllFamilies = async (req, res, next) => {
  const families = await Family.find()

  if(!families){
    return next(new globalError("No families, 404"))
  }

  res.status(200).json({
    status: "success",
    results: families.length,
    data: {
      families
    }
  })
}
