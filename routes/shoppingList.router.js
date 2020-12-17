const express = require("express");
const authController = require("./../controllers/authController");
// const familyController = require("./../controllers/familyController");
const shoppingListController = require("../controllers/shoppingListController");
const router = express.Router();

router.use(authController.protect);

router.get("/", shoppingListController.getAllLists);
router.get("/list/:id", shoppingListController.checkIfListExistsAndAllow, shoppingListController.getList);
router.post("/create", shoppingListController.createList);
router.post("/add/:id", shoppingListController.checkIfListExistsAndAllow, shoppingListController.addItemToList);
router.patch("/edit/:id", shoppingListController.checkIfListExistsAndAllow, shoppingListController.updateList);
router.patch("/delete/:id", shoppingListController.checkIfListExistsAndAllow, shoppingListController.deleteList);

module.exports = router;