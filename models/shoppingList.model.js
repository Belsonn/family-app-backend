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
});

const ShoppingList = mongoose.model("ShoppingList", shoppingListSchema);

module.exports = ShoppingList;
