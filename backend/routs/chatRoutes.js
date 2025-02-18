const { Router } =require('express');
const {authenticate}=require("../controller/authentication");
const {accessChat,fetchChats} = require('../controller/chatController')


const router= Router();

router.use(authenticate)

router.route("/").post( accessChat);
router.route("/").get( fetchChats);
// router.route("/group").post( createGroupChat);
// router.route("/rename").put( renameGroup);
// router.route("/groupremove").put( removeFromGroup);
// router.route("/groupadd").put( addToGroup);

module.exports =router;