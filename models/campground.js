var mongoose=require("mongoose")


//setting up schema

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	price: String,
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments:[  
		{   // comment linking with campground
			type:mongoose.Schema.Types.ObjectId,
			ref:"Comment"
		}
	]
})
module.exports = mongoose.model("Campground", campgroundSchema);