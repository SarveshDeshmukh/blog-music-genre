var express    = require("express"),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose");
    app        = express();
 
 //APP CONFIG   
mongoose.connect("mongodb://localhost/musicGenreBlog",{useMongoClient : true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created :{
                type: Date, 
                default: Date.now()
             }
});

var Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES

app.get("/", function(req, res){
    res.redirect("/genres");
});


//INDEX ROUTE
app.get("/genres", function(req, res){
 
  Blog.find({},function(err, genres){
      if(err){
          console.log(err);
      }
      else{
       res.render("index", {genres : genres});   
      }
  })
});

//NEW ROUTE
app.get("/genres/new", function(req, res){
    res.render("new");
});

//CREATE ROUTE

app.post("/genres", function(req, res){
    //Create genre
    Blog.create(req.body.genre, function(err, newGenre){
       if(err){
           res.render("new");
       } 
       else{
           res.redirect("/genres");
       }
    })
    //Redirect
    
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running!");
});