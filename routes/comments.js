var express = require("express");
var router = express.Router({mergeParams:true}),
	Campground= require("../models/campground"),
	Comment= require("../models/comment"),
	methodOverride = require("method-override"),
	expressSanitizer=require("express-sanitizer"),
	middleware=require("../middleware");

router.use(expressSanitizer());
router.use(methodOverride("_method"));

//Comment new
router.get("/new", middleware.isLoggedIn ,function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
});
 
//comments create
router.post("/", middleware.isLoggedIn ,function(req,res){
	//lookup campground using id
	 Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
			res.redirect("/campgrounds");
        } else {
	//create new comment
		Comment.create(req.body.comment, function(err, comment){
			 if(err){
            console.log(err);
			 } else {
				 // add username and id to comment
				 comment.author.id = req.user._id;
				 comment.author.username = req.user.username;
				 //save comment
				 comment.save()
	// connect new comment to campground
				campground.comments.push(comment);
				campground.save();
	//redirect to campground show page
				res.redirect("/campgrounds/" + campground._id);
			}
		})
		}
	 })
})

// EDIT COMMENTS

//EDIT CAMPGROUND ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
	var campid = req.params.id
	Comment.findById(req.params.comment_id, function(err,foundComment){
		if(err){	
			res.redirect("/campgrounds/:id");
			alert("Unable to edit Comment");
		}
		else{
			res.render("comments/edit", {comment:foundComment, campground_id:campid})
		}
	})
})

//UPDATE CAMPGROUND ROUTE

router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){  
	req.body.comment.body = req.sanitize(req.body.comment.body)
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if(err){	
			res.redirect("back");
		}
		else{
			res.redirect("/campgrounds/" + req.params.id)
		}
	})
})

//delete 
router.delete("/:comment_id",  middleware.checkCommentOwnership, function(req,res){  
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){	
			res.redirect("back")

		}
		else{
			res.redirect("/campgrounds/" + req.params.id)
		}
	})
})

module.exports = router;

