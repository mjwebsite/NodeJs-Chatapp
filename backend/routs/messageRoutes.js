const { Router } =require('express');
const {authenticate}=require("../controller/authentication");
const {sendMessage, allMessages}= require('../controller/messageController')


const router= Router();

router.use(authenticate)


router.route("/:chatId").get( allMessages);
router.route("/").post( sendMessage);

module.exports =router;