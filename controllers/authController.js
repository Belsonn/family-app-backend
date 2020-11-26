const User = require("./../models/user.model");
const jwt_simple = require("jwt-simple");
const globalError = require("./../utils/globalError");
// const Email = require("./../utils/email");

const signToken = (id) => {
  return jwt_simple.encode(
    { id, expiresIn: process.env.JWT_EXPIRES_IN },
    process.env.JWT_SECRET
  );
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
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

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    expiresIn,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return next(
      new globalError("User with this email or name already exists.", 400)
    );
  }
  const newUser = await User.create(req.body);

  // const activateToken = newUser.createActivationToken();
  await newUser.save({ validateBeforeSave: false });

  createSendToken(newUser, 200, res);

  // let activationUrl;

  // if (process.env.NODE_ENV == "development") {

  //   activationUrl = `${process.env.FRONT_URL_DEV}activate/${activateToken}`;

  // } else if(process.env.NODE_ENV =='production') {

  //   activationUrl = `${process.env.FRONT_URL}activate/${activateToken}`;

  // }

  // try {
  //   await new Email(newUser, activationUrl).send();

  //   res.status(200).json({
  //     status: "success",
  //     message: "Token sent to email",
  //   });
  // } catch (err) {

  //   newUser.activationToken = undefined;

  //   await newUser.save({ validateBeforeSave: false });

  //   return next(new globalError("There was an error sending the mail", 500));
  // }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new globalError("Please provide email and password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new globalError("Incorrect email, password or account is not active", 401)
    );
  }

  createSendToken(user, 200, res);
};

// exports.activateAccount = async (req, res, next) => {
//   let user = await User.findOne({ activationToken: req.body.activationToken });

//   console.log(req.body.activationToken);

//   if (!user) {
//     return next(new globalError("Provided wrong activationToken", 404));
//   }

//   user = await User.findByIdAndUpdate(
//     user._id,
//     { active: true, activationToken: undefined },
//     { new: true }
//   );

//   createSendToken(user, 200, res);
// };

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

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new globalError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  req.user = currentUser;
  next();
};
