var express    = require("express"),
app        = express(),
bodyParser = require("body-parser"),
mongoose   = require("mongoose"),
Comment = require("./models/comment"),
flash      =require("connect-flash"),
seedDB     = require("./seed"), //seed the database
passport       = require("passport"),
LocalStrategy  = require("passport-local"),
passportLocalMongoose  = require("passport-local-mongoose"),
 User= require("./models/user"),
Campground= require("./models/campground"),
methodOverride = require("method-override"),
expressSanitizer=require("express-sanitizer");

// requiring routes
var commentRoutes = require("./routes/comments"),
campgroundRoutes = require("./routes/campgrounds"),
indexRoutes = require("./routes/index")

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp_v12");
//seedDB();

app.use(express.static(__dirname + "/public"))  // adding stylesheet
app.use(methodOverride("_method"));

//passport config
app.use(require("express-session")({
secret:"hahaha hahaahaha",
resave:false,
saveUninitialized:false
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
// this is so we don't pass currentUser property to every page so code doesn't break
res.locals.currentUser = req.user;
res.locals.error=req.flash("error");
res.locals.success=req.flash("success")
next();
})
app.use(expressSanitizer());


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);


app.listen(3000,process.env.IP,function(){
console.log("The beginning of yelpcamp");
})

