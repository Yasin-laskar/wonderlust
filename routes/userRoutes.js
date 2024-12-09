const express=require("express");
const router = express.Router();


const bodyParser = require("body-parser");
const passport = require("passport");
const wrapAsync = require("../util/wrapAsync.js");
const { savedRedirectUrl } = require("../middleware.js");
router.use(bodyParser.urlencoded({ extended: true }));
const controller=require("../controllers/user.js");



router.route("/signup")
.get(controller.SignupForm)
.post(
  wrapAsync(controller.PostSingup)
);


router.route("/login")
.get(controller.LoginForm)
.post(
  savedRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  controller.postLogin
);

  router.get("/logout",controller.logOut);
  

module.exports=router;
  




  

  




