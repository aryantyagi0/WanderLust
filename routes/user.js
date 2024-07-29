
const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const userController=require("..controllers/users.js");
router.get("/signup", userController.rendersignup); // Render the signup form
router.get("/signup",(req,res)=>{
    res.render("form")
})
router.get("/login",userController.renderlogin);
router.post("/signup",userController.signup);
router.post("/login",passport.authenticate("local",{failureRedirect:"/listings/login",failureFlash:true,

}),usercontroller.login);
router.get("/logout",userController.logout);
module.exports = router;