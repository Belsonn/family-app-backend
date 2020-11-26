const globalError = require("./../utils/globalError");
const User = require("./../models/user.model");

exports.getMe = async (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new globalError("There are no users with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};
