const globalError = require("./../utils/globalError");
const Family = require("./../models/family.model");
const FamilyUser = require("./../models/familyuser.model");
const { findByIdAndUpdate } = require("./../models/family.model");

exports.createList = async (req, res, next) => {
  let list = {
    name: req.body.name,
    list: [],
    createdBy: req.familyUser._id,
  };

  let family = await Family.findByIdAndUpdate(
    req.family._id,
    {
      $push: { groceries: list },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      groceries: family.groceries,
    },
  });
};

exports.addGrocery = async (req, res, next) => {
  const grocery = {
    item: {
      name: req.body.name,
      quantity: req.body.quantity,
      details: req.body.details,
    },
    createdAt: Date.now(),
    createdBy: req.familyUser._id,
    completedAt: null,
  };

  family = await Family.findOneAndUpdate(
    { _id: req.family._id, groceries: { $elemMatch: { _id: req.body.id } } },
    {
      $push: {
        "groceries.$.list": grocery,
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      family,
    },
  });
};

exports.updateList = async (req, res, next) => {
  family = await Family.findOneAndUpdate(
    { _id: req.family._id, groceries: { $elemMatch: { _id: req.body._id } } },
    {
      $set: {
        "groceries.$.list": req.body.list,
        "groceries.$.name": req.body.name,
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      groceries: family.groceries,
    },
  });
};

exports.deleteList = async (req, res, next) => {
  const family = await Family.findByIdAndUpdate(
    req.family._id,
    { $pull: { "groceries": {_id: req.body.id} } },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      groceries: family.groceries,
    },
  });
};
