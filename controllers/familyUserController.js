const globalError = require("./../utils/globalError");
const FamilyUser = require("./../models/familyuser.model");
const Family = require("./../models/family.model");

const multer = require("multer");
const sharp = require("sharp");

let memoryStorage = multer.memoryStorage();


const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);///
  } else {
    cb(new globalError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({ storage: memoryStorage, fileFilter:multerFilter });

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.params.familyUserId}.jpeg`;

  await sharp(req.file.buffer)
    .resize(200, 200)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`./photos/users/${req.file.filename}`);

  next();
};

exports.addPhoto = async (req, res, next) => {

  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    req.body.photo = url + "/photos/users/" + req.file.filename
  } 

  // 3) Update user document
  const familyUser = await FamilyUser.findByIdAndUpdate(
    req.familyUser._id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  const family = await Family.findById(familyUser.family)

  res.status(200).json({
    status: "success",
    data: {
      familyUser,
      family
    },
  });
};

exports.updateMe = async (req, res, next) => { 
  
}

exports.getMe = async (req, res, next) => {
  req.params.id = req.familyUser.id;
  next();
};

exports.getUser = async (req, res, next) => {
  const user = await FamilyUser.findById(req.params.id);

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
