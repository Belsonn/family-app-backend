const globalError = require("../utils/globalError");
const Family = require("../models/family.model");
const shoppingList = require("../models/shoppingList.model");

exports.getAllLists = async (req, res, next) => {
  const family = await Family.findById(req.family._id);

  res.status(200).json({
    status: "success",
    data: {
      groceries: family.groceries,
    },
  });
};

exports.getList = async (req, res, next) => {
  let id = req.params.id;

  // const list = await Family.findOne({ _id: req.family._id }).select({
  //   groceries: { $elemMatch: { _id: id } },
  // })
  // console.log(list);
  //SAME
  const list2 = await Family.findOne({'_id': req.family._id, 'groceries._id': id}, {"groceries.$": 1})

  if (!list.groceries[0]) {
    return next(new globalError("Theres no list with that id", 404));
  }

  const fixedList = list.groceries[0];

  res.status(200).json({
    status: "success",
    data: {
      list2
    },
  });
};

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
    item: req.body.item,
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
      groceries: family.groceries,
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
    { $pull: { groceries: { _id: req.body.id } } },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      groceries: family.groceries,
    },
  });
};
