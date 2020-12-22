const mongoose = require("mongoose");

const shoppingListSchema = new mongoose.Schema({
  name: String,
  list: {
    type: [
      {
        // category: {
        //   name: String,
        //   icon: String
        // },
        name: String,
        quantity: Number,
        details: String,
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FamilyUser",
        },
        createdAt: Date,
        completedAt: Date,
      },
    ],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FamilyUser",
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  completedAt: {
    type: Date,
    default: null
  }
});

shoppingListSchema.pre(/^find/, function (next) {
  this.select("-__v");
  this.populate({
    path: "createdBy",
    select: "-__v -password -family -points -gender -dateOfBirth",
  });
  this.populate({
    path: "list",
    populate: {
      path: "createdBy",
      select: "-__v -password -family -points -gender -dateOfBirth",
    },
  });

  next();
});

const ShoppingList = mongoose.model("ShoppingList", shoppingListSchema);

module.exports = ShoppingList;
