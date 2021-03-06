const jwt_simple = require("jwt-simple");
const globalError = require("./../utils/globalError");
const FamilyUser = require("./../models/familyuser.model");
const Family = require("./../models/family.model");

const signToken = (id) => {
  return jwt_simple.encode(
    { id, expiresIn: process.env.JWT_EXPIRES_IN },
    process.env.JWT_SECRET
  );
};

exports.createSendToken = (familyUser, statusCode, res) => {
  const token = signToken(familyUser._id);
  const expiresIn = new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  );
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  familyUser.password = undefined;


  res.status(statusCode).json({
    status: "success",
    token,
    expiresIn,
    data: {
      familyUser,
    },
  });
};

// exports.signup = async (req, res, next) => {
//   const user = await User.findOne({ email: req.body.email });
//   if (user) {
//     return next(
//       new globalError("User with this email or name already exists.", 400)
//     );
//   }
//   const newUser = await User.create(req.body);

//   await newUser.save({ validateBeforeSave: false });

//   this.createSendToken(newUser, 200, res);

// };

// exports.login = async (req, res, next) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return next(new globalError("Please provide email and password!", 400));
//   }

//   const user = await User.findOne({ email }).select("+password");
//   if (!user || !(await user.correctPassword(password, user.password))) {
//     return next(
//       new globalError("Incorrect email, password or account is not active", 401)
//     );
//   }

//   this.createSendToken(user, 200, res);
// };

exports.loginLocal = async (req, res, next) => {
  const { familyUserId, password } = req.body;

  if (!familyUserId || !password) {
    return next(new globalError("Provide ID and Password", 400));
  }

  const familyUser = await FamilyUser.findById(familyUserId)
    .select("+password")
    .select("+family");

  if (
    !familyUser ||
    !(await familyUser.correctPassword(password, familyUser.password))
  ) {
    return next(new globalError("Incorrect password", 400));
  }
  const family = await Family.findById(familyUser.family);

  this.createSendToken(familyUser, 200, res);

};

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new globalError(
        "You are not logged in! Please log in to get access.",
        401
      )
    );
  }
  const decoded = await jwt_simple.decode(token, process.env.JWT_SECRET);
  const currentUser = await FamilyUser.findById(decoded.id);
  if (!currentUser) {
    return next(
      new globalError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  const family = await Family.findById(currentUser.family)

  req.familyUser = currentUser;
  req.family = family 
  next();
};
