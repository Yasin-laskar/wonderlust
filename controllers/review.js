const listing =require("../models/listing.js");
const Review = require("../models/review.js");




module.exports.PostReview=async (req, res) => {
    let Listing = await listing.findById(req.params.id);
    if (!Listing) {
        return res.status(404).send("Listing not found");
    }

    let newReview = new Review(req.body.Review);
    newReview.author=req.user._id;
    Listing.reviews.push(newReview);
    console.log(newReview.author);
    req.flash("success","new review is added");

    await newReview.save();
    await Listing.save();
    console.log(Listing);
    console.log(newReview);

    res.redirect(`/listings/${req.params.id}`);
}


module.exports.DestroyReview=async (req, res) => {
    const { id, rId } = req.params;

    // Remove the review from the database
    await Review.findByIdAndDelete(rId);
    req.flash("success","review is deleted");

    // Remove the review reference from the listing's reviews array
    await listing.findByIdAndUpdate(id, { $pull: { reviews: rId } });

    
    res.redirect(`/listings/${id}`);
};