const globalError = require("../utils/globalError");
const Family = require("../models/family.model");
const shoppingList = require("../models/shoppingList.model");
const ShoppingList = require("../models/shoppingList.model");
const mongoose = require("mongoose");

exports.checkIfListExistsAndAllow = async (req, res, next) => {
  let allow = false;

  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new globalError("This is not valid ID", 400));
  }

  const list = await ShoppingList.findOne({ _id: req.params.id }).populate(
    "shoppingLists"
  );

  const family = await Family.findById(req.family._id).populate(
    "shoppingLists"
  );

  if (!list) {
    return next(new globalError("This list does not exists", 404));
  }
  family.shoppingLists.forEach((el) => {
    el._id == req.params.id ? (allow = true) : null;
  });


  if (!allow) {
    return next(new globalError("You are not allowed to do that", 401));
  }
  next();
};

exports.getAllLists = async (req, res, next) => {
  const family = await Family.findById(req.family._id).populate(
    "shoppingLists"
  );

  res.status(200).json({
    status: "success",
    data: {
      lists: family.shoppingLists,
    },
  });
};

exports.getList = async (req, res, next) => {
  const list = await ShoppingList.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      list,
    },
  });
};

exports.createList = async (req, res, next) => {
  const list = await ShoppingList.create({
    name: req.body.name,
    list: [],
    createdBy: req.familyUser._id,
  });

  const family = await Family.findByIdAndUpdate(
    req.family._id,
    {
      $push: { shoppingLists: list._id },
    },
    { new: true }
  ).populate("shoppingLists");

  res.status(200).json({
    status: "success",
    data: {
      lists: family.shoppingLists,
    },
  });
};

exports.addItemToList = async (req, res, next) => {
  const item = {
    name: req.body.name,
    quantity: req.body.quantity,
    details: req.body.details,
    createdAt: Date.now(),
    createdBy: req.familyUser._id,
    completedAt: null,
  };

  const shoppingList = await ShoppingList.findByIdAndUpdate(
    req.params.id,
    {
      $push: { list: item },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      shoppingList,
    },
  });
};

exports.updateList = async (req, res, next) => {
  const list = await ShoppingList.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      list,
    },
  });
};

exports.deleteList = async (req, res, next) => {
  const list = await ShoppingList.findByIdAndDelete(req.params.id);

  const family = await Family.findByIdAndUpdate(
    req.family._id,
    { $pull: { shoppingLists: req.params.id } },
    { new: true }
  ).populate("shoppingLists");

  res.status(200).json({
    status: "success",
    data: {
      lists: family.shoppingLists,
    },
  });
};

exports.tenLastProducts = async (req, res, next) => {
  const family = await Family.findById(req.family._id).populate(
    "shoppingLists"
  );

  const lists = family.shoppingLists;

  let products = [];

  // Get all products
  lists.forEach((list) => {
    products.push(...list.list);
  });

  // Remove duplicates
  unique = [...new Map(products.map((el) => [el["name"], el])).values()];

  // Sort by date
  unique.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Keep only 10
  howMuch = unique.length - 10;
  unique.splice(9, howMuch);

  res.status(200).json({
    status: "success",
    results: unique.length,
    data: {
      products: unique,
    },
  });
};
