
const { ref, string, number, required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review.js");

const defaultUrl = "https://images.unsplash.com/photo-1729517483083-527809ec5469?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzNHx8fGVufDB8fHx8fA%3D%3D";

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url:String,
    filename:String
  },
  price: Number,
  location: String,
  country: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  reviews:[{
    type:Schema.Types.ObjectId,
    ref:"Review"
  }],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  }
});


listingSchema.post("findOneAndDelete",async(listing)=>{
  await Review.deleteMany({_id:{$in:listing.reviews}});
})

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
