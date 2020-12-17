const express = require("express");
const authController = require("./../controllers/authController");
// const familyController = require("./../controllers/familyController");
const shoppingListController = require("../controllers/shoppingListController");
const router = express.Router();

router.use(authController.protect);

router.get("/list/", shoppingListController.getAllLists);
router.get("/list/:id", shoppingListController.getList);
router.post("/createList", shoppingListController.createList);
router.post("/addGrocery", shoppingListController.addGrocery);
router.patch("/editList", shoppingListController.updateList);
router.patch("/deleteList", shoppingListController.deleteList);