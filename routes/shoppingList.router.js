const express = require("express");
const authController = require("./../controllers/authController");
// const familyController = require("./../controllers/familyController");
const shoppingListController = require("../controllers/shoppingListController");
const router = express.Router();

router.use(authController.protect);

router.get("/", shoppingListController.getAllLists);
router.get("/lastTen", shoppingListController.tenLastProducts);
router
  .route("/list/:id")
  .all(shoppingListController.checkIfListExistsAndAllow)
  .get(shoppingListController.getList)
  .patch(shoppingListController.updateList)
  .delete(shoppingListController.deleteList);
router.post("/create", shoppingListController.createList);
router.post(
  "/add/:id",
  shoppingListController.checkIfListExistsAndAllow,
  shoppingListController.addItemToList
);


module.exports = router;
