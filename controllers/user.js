const User=require("../models/user.js");
const express=require("express");
const router = express.Router();

const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: true }));


module.exports.SignupForm=(req,res)=>{
    res.render("./signup/signup.ejs");
}

module.exports.PostSingup=async (req, res, next) => {
    try {
      let { email, username, password } = req.body;

      let newUser = new User({ email, username });
      console.log(newUser);

      let registeredUser = await User.register(newUser, password);

      req.login( registeredUser,
       (err) => {
        if (err) {
          return next(err); 
        }
        req.flash("success", "Welcome to Wonderlust");
        return res.redirect("/listings"); 
      });
    } catch (err) {
      req.flash("error", err.message);
      return res.redirect("/signup"); 
    }
  };

  module.exports.LoginForm=(req,res)=>{
    res.render("./signup/login");
};


module.exports.postLogin=(req, res) => {
    req.flash("success","welcome to wonderlust");
    console.log(res.locals.redirectUrl);
    res.redirect(res.locals.redirectUrl || "/listings");
  };

  module.exports.logOut=(req,res)=>{
    req.logOut((err)=>{
      if(err)
        return next(err);
      req.flash("success","logged out");
      res.redirect("/listings");
    })
  }