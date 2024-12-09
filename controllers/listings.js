const listing =require("../models/listing.js");
const ExpressError=require("../util/ExpressError.js");
const {listingSchema}=require ("../schema.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingclient = mbxGeocoding({ accessToken: mapToken });





module.exports.index=async(req,res,next)=>{
   
    let allListing= await listing.find();
    res.render("./listings/index.ejs",{allListing});
}

module.exports.RenderListingForm=(req,res)=>{
    
    res.render("./listings/new");
}

// module.exports.PostingNewListing=async (req,res,next)=>{
      
//     let result= listingSchema.validate(req.body);
//     req.flash("success","new listing added");
//     console.log(result);

//   let response=await geocodingclient.forwardGeocode({
//   query:req.body.listing.location,
//   limit: 1
// })
//   .send()
  
 
  
//      if(result.error)
//      {
//          throw new ExpressError(400,result.error);
//      }
//      let newListing= new listing (req.body.listing);
//      let url=req.file.path;
//      let filename=req.file.filename;
//      newListing.image={url,filename};
//      newListing.owner=req.user._id;
//      newListing.geometry=response.body.features[0].geometry;
//      console.log(req.body.listing);
//      console.log(newListing);
//      await newListing.save();
  
//     res.redirect("/listings");

// };



module.exports.PostingNewListing = async (req, res, next) => {
  

    // Geocoding
    let response;
    try {
      response = await geocodingclient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      }).send();
    } catch (error) {
      throw new ExpressError(500, "Failed to fetch geocoding data");
    }

    if (!response.body.features.length) {
      throw new ExpressError(400, "Invalid location provided");
    }

    // Create listing
    const newListing = new listing(req.body.listing);
    let url, filename;

    if (req.file) {
      url = req.file.path;
      filename = req.file.filename;
    } else {
      url = defaultUrl;
      filename = "default";
    }

    newListing.image = { url, filename };
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;

    await newListing.save();

    req.flash("success", "New listing added successfully");
    res.redirect("/listings");
  };












module.exports.RenderEditForm=async(req,res)=>{
    let {id}=req.params;
    console.log(id);
    let data= await listing.findById(id);
    console.log(data);
    if(!data){
        res.flash("wrong","the page you are requested isnt found!");
        res.redirect("/listings");
    }
    let originalImage=data.image.url;
   
    originalImage=originalImage.replace("/upload","/upload/w_250");
   
    res.render("./listings/edit.ejs",{data,originalImage});
};

module.exports.UpdateEditedForm=async(req,res)=>{
    let {id}=req.params;
   
    let listings=await listing.findById(id);
    if(!res.locals.currUser._id.equals(listings.owner)){
        req.flash("success","you are not the owner");
      return  res.redirect("/listings");
    }
   listings= await  listing.findByIdAndUpdate(id,{...req.body.listing});
   if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listings.image={url,filename};
    await listings.save();
   }
    req.flash("success"," Listing updated");
    res.redirect("/listings");
};

module.exports.DeytroyListing=async(req,res)=>{
    let{id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Listing is deleted");
    res.redirect("/listings");

};

module.exports.ShowRoute=async(req,res)=>{
    let {id}=req.params;
    console.log(id);
    
    let data= await listing.findById(id).populate({path:"reviews",
        populate:{path:"author"},
    })
    .populate("owner");
    console.log(data);
    if(!data){
        req.flash("unsuccess","the page you are requested isnt found!");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{data});

}