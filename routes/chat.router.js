const express = require("express");
const authController = require("./../controllers/authController");
const chatController = require("./../controllers/chatController")
const router = express.Router();

router.use(authController.protect);

router.get('/', chatController.getMessages);
router.get('/all', chatController.getAllMessages);
router.post('/add', chatController.addMessage);
router.get('/moreMessages/:messages', chatController.getMoreMessages);


module.exports = router;