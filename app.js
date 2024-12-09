require("dotenv").config();

const express=require ("express");
const app=express();
const mongoose=require("mongoose");
const path=require ("path");
const methodOverride = require('method-override');
const ejsMate=require("ejs-mate");
const ExpressError=require("./util/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy = require('passport-local').Strategy;
const User=require("./models/user.js");



const listingsRoute=require("./routes/listingRoutes.js");
const reviewsRoute=require("./routes/reviewRoutes.js");
const userRoute=require("./routes/userRoutes.js");
 

 
const dbUrl = process.env.mongodbAtlas; 

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    
    touchAfter:24*3600,
})
store.on("err",(err)=>{
    console.log("some error in mongodb:",err);
})

let sessionOption=
    {
        store,
        secret:process.env.SECRET,
        resave:false,
        saveUninitialized:true,
        cookie:{
            secure:false,
            expires:Date.now()+7*24*60*60*1000,
            maxAge:7*24*60*60*1000,
            httpOnly:true,
        }
    };

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
   
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



main()
  .then(() => {
    console.log("I'm connected to the database named wonderLust");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

async function main() {
  // Connect to the MongoDB database "wonderLust"
  await mongoose.connect(dbUrl);
}


let port=3000;

app.listen(port,()=>{
    console.log(`reporting from the port number ${port}`);
});




app.use((req,res,next)=>{
    res.locals.message=req.flash("success");
    res.locals.wrong=req.flash("unsuccess");
    res.locals.currUser=req.user;
    next();
});




app.use("/listings", listingsRoute);
app.use("/listings/:id/reviews",reviewsRoute);
app.use("/",userRoute);

 

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})
 

app.use((err, req, res, next) => {
    // Default to 500 (Internal Server Error) if statusCode is not set
    const statusCode = err.statusCode || 500;
    // Default to a generic error message if message is not provided
    const message = err.message || "Something went wrong, please try again later.";

    // Log the error for debugging purposes (optional)
    console.error(err);

    // Send the error response
    res.status(statusCode).render("error.ejs", { message });
});



