
const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
// router.get("/signup", (req, res) => {
//     res.render("users/signup"); // Render the signup form
// });

router.get("/signup",(req,res)=>{
    res.render("form")
})
// router.get("/login",(req,res)=>{
//     res.render("users/login")
// })
// router.post("/signup",async(req,res)=>{
//     try{
//     let {username,email,password}=req.body;
//     const newUser=new User({username,email});
//     const registeredUser=await User.register(newUser,password);
//     console.log(registeredUser);
//     req.login(registeredUser,(err)=>{
//         if(err){
//             return next(err);
//         }
//         req.flash("success","welocme to wanderlust");
//         res.redirect("res.locals.redirectUrl");
//     })
//     }
//     catch(e){
//         req.flash("error",e.message);
//         res.redirect("/listings/signup");
//     }
// })
// router.post("/login",passport.authenticate("local",{failureRedirect:"/listings/login",failureFlash:true,

// }),async(req,res)=>{
//     res.redirect("/listings");
// }
// );
// router.get("/logout",(req,res,next)=>{
//     req.logout((err)=>{
//         if(err){
//             return next(err);
//         }
//         req.flash("success","you are logged out!");
//         res.redirect("/listings");
//     })
// })
 module.exports = router;