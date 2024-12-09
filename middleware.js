const passport = require("passport")
const listing =require("./models/listing.js");
const {listingSchema,reviewSchema}=require ("./schema.js");
const review=require("./models/review.js");
const ExpressError=require("./util/ExpressError.js")


// module.exports.validateListing=(req,res,next)=>{
//   let {error}=listingSchema.validate(req.body);
//   if(error){
//       let  errMsg=error.details.map((el)=>
//       el.message).join(",");
//       throw new ExpressError(400,errMsg);
//   }else{
//       next();
//   }
// };



module.exports.validateListing = (req, res, next) => {
    // Validate the request body using listingSchema
    let { error } = listingSchema.validate(req.body);

    if (error) {
        // Join the error messages into a single string
        let errMsg = error.details.map((el) => el.message).join(", ");
        
        // Pass the error to the next middleware
        return next(new ExpressError(400, errMsg)); // Use next() to handle the error
    }

    // If validation passes, move to the next middleware
    next();
};




module.exports.validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  if(error){
      let  errMsg=error.details.map((el)=>
      el.message).join(",");
      throw new ExpressError(400,errMsg);
  }else{
      next();
  }
};

  module.exports.isLoggedIn = (req, res, next) => {
    console.log(`Attempted access to: ${req.originalUrl}`);
  
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // Store return URL in session
        req.flash("success", "Please login or signup to access this page.");
        return res.redirect("/login");
    }
  
    next();
};

  module.exports.savedRedirectUrl = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.redirectUrl = req.session.returnTo; // Use returnTo from session
        delete req.session.returnTo; // Remove it after redirecting
    }
    next();
};

module.exports.isOwner= async(req,res,next)=>{
    let {id}=req.params;
    let listings=await listing.findById(id);
    if(!res.locals.currUser._id.equals(listings.owner)){
        req.flash("unsuccess","you are not the owner");
      return  res.redirect(`/listings/${id}`);
    }
    next();
 }

module.exports.isReviewAuthor= async(req,res,next)=>{
    let {id,rId}=req.params;
    let reviews=await review.findById(rId);
    console.log(`rid:${rId} "...." ${reviews}`);
    if(!res.locals.currUser._id.equals(reviews.author)){
        req.flash("unsuccess","you are not the owner");
      return  res.redirect(`/listings/${id}`);
    }
    next();
 }


