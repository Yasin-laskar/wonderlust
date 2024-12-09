const express=require("express");
const app=express();
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(session({secret:"thismysupersecretcode",
    resave:false,
    saveUninitialized:true
}));

app.use(flash());

app.listen(8080,()=>{
    console.log(`listing from the port ${8080}`);

});


app.get("/reqCount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
    
    res.send(`the number of times u revisited the page ${req.session.count}`);
});

app.get("/register",(req,res)=>{
   let {name="annonyamous"} =req.query;
   
    req.session.name=name;
    req.flash('success', 'the user is registered successfully');
    console.log(req.session.name);
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
     res.locals.message=req.flash("success");
    res.render("user.ejs",{name:req.session.name});
})


app.get("/test",(req,res)=>{
    res.send("this the test route");
})

