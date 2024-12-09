const express=require("express");
const router = express.Router();
const wrapAsync=require("../util/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const controllers=require("../controllers/listings.js");
const multer  = require('multer');
const{storage}=require("../cloudinary.js");
const upload = multer({ storage });



//index : where all the listings are showing
router.get("/",wrapAsync(controllers.index));

//this route to render the form
router.get("/new",isLoggedIn,controllers.RenderListingForm);

// create route
router.post("/created", isLoggedIn,upload.single("listing[image]"), validateListing, wrapAsync(controllers.PostingNewListing));


// edit route

router.get("/:id/edit",isLoggedIn ,isOwner,wrapAsync(controllers.RenderEditForm));

//update route and show route
router.route("/:id")
.put( upload.single("listing[image]"),validateListing, isOwner,wrapAsync(controllers.UpdateEditedForm))
.get(wrapAsync(controllers.ShowRoute));

//delete route

router.delete("/:id/delete",isLoggedIn,isOwner,wrapAsync(controllers.DeytroyListing));





module.exports=router;

