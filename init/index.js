const mongoose=require("mongoose");
const listing =require("../models/listing.js");
const initData=require("./data.js");



main().then(()=>{
    console.log("im connected to the data base name wonderLust")
}).catch((err)=>{
    console.log(err);
});


async function  main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
    
}

//make a function to insert all the data
 
const initDB=async()=>{
await listing.deleteMany({});
 initData.data=initData.data.map((obj)=>({...obj,owner:'67448789268725d58b655aa4'}));
await listing.insertMany(initData.data);
console.log("data was initialize");


};

initDB();


