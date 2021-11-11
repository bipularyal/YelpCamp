var Campground = require("../models/campground"),
	Comment = require("../models/comment");

//all middleware goes here
var middlewareObj={};
middlewareObj.checkCampgroundOwnership = function(req,res,next){
		//is user logged in
	if(req.isAuthenticated()){
			 Campground.findById(req.params.id, function(err,foundCampground){
		if (err){
			req.flash("error","Campground Not Found")
			res.redirect("back");
		} else {
			//does user own campground
			if(foundCampground.author.id.equals(req.user._id)){
				next();
				} else{ //if not redirect
					req.flash("error","You don't own this campground")
					res.redirect("back")}
		}
	})	
	} else {
		req.flash("error","You need to be logged in to do that")
		//if not redirecct
		res.redirect("back");
		
	}
}

middlewareObj.checkCommentOwnership = function(req,res,next){
		//is user logged in
	if(req.isAuthenticated()){
			 Comment.findById(req.params.comment_id, function(err,foundComment){
		if (err){
			res.redirect("back");
		} else {
			//does user own campground
			if(foundComment.author.id.equals(req.user._id)){
				next();
				} else{ //if not redirect
					req.flash("error","You do not own comment")
					res.redirect("back")}
		}
	})
		
	} else {
		req.flash("error","You need to be logged in to do that")
		//if not redirecct
		res.redirect("back");
		
	}
}

middlewareObj.isLoggedIn = function(req,res,next){  // to make user unable to do something while logged out if not logged in
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in");
	res.redirect("/login");
}



module.exports = middlewareObj