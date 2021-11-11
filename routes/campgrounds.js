var express = require("express");
var router = express.Router(),
	Campground= require("../models/campground"),
	methodOverride = require("method-override"),
	expressSanitizer=require("express-sanitizer"),
	middleware=require("../middleware");


	
//index shows all campgrounds
router.get("/", function(req,res){	
	//getting all campgrounds from database and render that file
	Campground.find({},function(err,allcampgrounds){
			if (err){
				console.log("there's error");
			}
			else{
				console.log("no error");
				// rendering info that comes from database
				res.render("campgrounds/index",{campgrounds:allcampgrounds});
			}
		})
	
	//
})

router.use(expressSanitizer());
router.use(methodOverride("_method"));


//create new cmpground
router.post("/", middleware.isLoggedIn ,function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var description = req.body.description;
	var author={
		id: req.user._id,
		username:req.user.username
	}
	var newCampground = {name:name, price:price ,image:image, description:description, author:author};
	
	// saving the new campgrounds info given by user
	Campground.create(newCampground,function(err,newCampground){
		if(err){ console.log("44 oo error");}
		else{console.log(newCampground)
			res.redirect("/campgrounds");}
	})
	
})
//show form to create new campground
router.get("/new",middleware.isLoggedIn ,function(req,res){
	res.render("campgrounds/new")
})

// more info about a campground
router.get("/:id", function(req,res){
	//find the campground with provided id and 
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){ //each campground has unique id given to it by database
		if(err){
			console.log("error")
		}
		else{
			console.log(foundCampground)
			// render show template with that campground 
			res.render("campgrounds/show", {campground:foundCampground}); //so we can access campground information we found wirh id req.params.id in show template
		}
	})
})

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership ,function(req,res){
	Campground.findById(req.params.id, function(err,foundCampground){
		if(err){	
			res.redirect("/campgrounds/:id/edit")
			alert("Unable to edit Campground")
		}
		else{
			res.render("campgrounds/edit", {campground:foundCampground})
		}
	})
})

//UPDATE CAMPGROUND ROUTE

// this put is to update  (app.post also works put is just easier)
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){  
	req.body.campground.body = req.sanitize(req.body.campground.body)
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){	
			res.redirect("/campgrounds/:id/edit");
		}
		else{
			res.redirect("/campgrounds/" + req.params.id)
		}
	})
})

//delete 
router.delete("/:id", middleware.checkCampgroundOwnership ,function(req,res){  
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){	
			res.redirect("/campgrounds")

		}
		else{
			res.redirect("/")
		}
	})
})

module.exports = router;
