var express = require("express");
var router = express.Router(),
	passport = require("passport"),
	User=require("../models/user");


//landing page
router.get("/", function(req,res){
	res.render("landing")
})

//////////////////////// Authenticate ROUTES   /////////////////////////////
//signup
router.get("/register",function(req,res){
	res.render("register")
})
//handle signup
router.post("/register",function(req,res){
	var newUser = new User({username: req.body.username})
	User.register(newUser, req.body.password,function(err,user){
		if (err){console.log(err);
				 req.flash("error", err.message)
				return res.render("register")}
		passport.authenticate("local")(req,res, function(){
			req.flash("success", "Welcome to yelpcamp " + user.username)
			res.redirect("/campgrounds");
		})
	})
})

//show login form
router.get("/login",function(req,res){
	res.render("login");
})
//handle signup form
router.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),function(req,res){
	} 
)

//log out
router.get("/logout", function(req,res){
	req.logout();
	req.flash("success","Logged You Out")
	res.redirect("/campgrounds");
})

module.exports = router
