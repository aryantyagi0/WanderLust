const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review.js");
// const userRouter=require("./routes/user.js")
// const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
const sessionOptions = {
    secret: "mySuperSecretCode",
    resave: false,
    saveUninitialized: false, // explicitly set this option
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.currUser = req.user;
    res.locals.error = req.flash("error");
    next();
});
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("Connected to DB");
    })
    .catch(err => {
        console.log("Connection error:", err);
    });

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student123@gnail.com",
//         username: "delta-student"
//     });
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });
app.get("/listings/signup",(req,res)=>{
    res.render("users/signup")
})
app.get("/listings/login",(req,res)=>{
    res.render("users/login")
})
app.post("/listings/signup",async(req,res)=>{
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
        res.redirect("/listings");
    })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/listings/signup");
    }
})
app.post("/listings/login",passport.authenticate("local",{failureRedirect:"/listings/login",failureFlash:true,

}),async(req,res)=>{
    res.redirect("/listings");
}
);
app.get("/listings/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
})
// Define user routes first
// app.use("/", userRouter);

// Define listings routes next
app.use("/listings", listingsRouter);

// Define reviews routes last
app.use("/listings/:id/reviews", reviewsRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something Went Wrong" } = err;
    res.status(statusCode).render("listings/error", { message });
});

app.listen(8090, () => {
    console.log("Server is running on port 8090");
});
