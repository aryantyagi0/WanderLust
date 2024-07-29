module.exports.rendersignup=(req, res) => {
    res.render("users/signup"); // Render the signup form
};
module.exports.signup=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({username,email});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","welocme to wanderlust");
        res.redirect("res.locals.redirectUrl");
    })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/listings/signup");
    }
};
module.exports.login=async(req,res)=>{
    res.redirect("/listings");
}
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
};
module.exports.renderlogin=(req,res)=>{
    res.render("users/login")
};