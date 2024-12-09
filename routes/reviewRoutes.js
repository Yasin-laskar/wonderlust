const express=require("express");
const wrapAsync=require("../util/wrapAsync.js");
const controller=require("../controllers/review.js");
const router=express.Router({mergeParams:true});

const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");


//post review
router.post("/",isLoggedIn,validateReview, wrapAsync(controller.PostReview));

//delete review route
router.delete("/:rId",isReviewAuthor,wrapAsync(controller.DestroyReview));

module.exports=router;
