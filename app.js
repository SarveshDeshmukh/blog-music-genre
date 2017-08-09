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
    video: String,
    body : String,
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
    
    var urlToEmbed = getId( req.body.genre.video);
    console.log(urlToEmbed);
    req.body.genre.video = urlToEmbed;
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

//SHOW ROUTE

app.get("/genres/:id", function(req, res){

    Blog.findById(req.params.id, function(err, foundGenre){
        if(err){
            console.log(err);
        }
        else{
            res.render("show",{foundGenre : foundGenre});
        }
    })
});


function getId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return 'error';
    }
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running!");
});