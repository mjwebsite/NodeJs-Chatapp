const { Router } =require('express');
const userController=require("../controller/userController");
const {authenticate}=require("../controller/authentication")


const router= Router();

router.post("/register",userController.userCreate);

// router.use(authenticate)
// router.get("/register",controller.getUsers);
router.get("/register",userController.userFindOne);
router.post("/login",userController.userAuthentication);
router.get("/profile",authenticate,userController.userProfileFindOne);
router.post("/error",authenticate,userController.createError);

module.exports =router;