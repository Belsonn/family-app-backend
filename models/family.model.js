const mongoose = require("mongoose");
const crypto = require("crypto");

const familySchema = new mongoose.Schema({
  name: String,
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FamilyUser",
    },
  ],
  shoppingLists: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShoppingList",
      },
    ],
    select: false,
  },
  events: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    select: false,
  },
  messages: {
    type: [
      {
        date: {
          type: Date,
        },
        message: {
          type: String,
          required: [true, "A message should have a text."],
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FamilyUser",
        },
      },
    ],
    select: false,
  },
  tasks: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    select: false,
  },
  dailyTasks: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DailyTask",
      },
    ],
    select: false,
  },
  rewards: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reward",
      },
    ],
    select: false,
  },
  inviteToken: {
    type: String,
    uppercase: true,
  },
  createdAt: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FamilyUser",
  },
  settings: {
    calendar: {
      childCanCreateEvents: {
        type: Boolean,
        default: false,
      },
      childCanEditEvents: {
        type: Boolean,
        default: false,
      },
      childCanDeleteEvents: {
        type: Boolean,
        default: false,
      },
    },
    shoppingLists: {
      childCanCreateList: {
        type: Boolean,
        default: true,
      },
      childCanEditList: {
        type: Boolean,
        default: true,
      },
      childCanDeleteList: {
        type: Boolean,
        default: true,
      },
      childCanAddItemToList: {
        type: Boolean,
        default: true,
      },
      childCanEditItemOnList: {
        type: Boolean,
        default: true,
      },
    },
  },
});

familySchema.pre(/^find/, function (next) {
  this.select("-__v");
  this.populate({
    path: "users",
    select: "-__v -password -family",
  });

  next();
});

familySchema.pre("save", function (next) {
  if (this.isNew) {
    this.createdAt = Date.now();
    this.inviteToken = crypto.randomBytes(3).toString("hex");
  }
  next();
});

const Family = mongoose.model("Family", familySchema);

module.exports = Family;
