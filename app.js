var express    = require("express"),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose");
    app        = express();
    methodOverride = require("method-override");
 
 //APP CONFIG   
mongoose.connect("mongodb://localhost/musicGenreBlog",{useMongoClient : true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    video: String,
    videoEmbedLink: String,
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
    req.body.genre.videoEmbedLink = urlToEmbed;
    //Create genre
    Blog.create(req.body.genre, function(err, newGenre){
       if(err){
           res.render("new");
       } 
       else{
           res.redirect("/genres");
       }
    })
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

//EDIT ROUTE
app.get("/genres/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundGenre){
        if(err){
            res.redirect("/genres");
        }
        else{
            res.render("edit", {foundGenre: foundGenre});   
        }
    });
});

//PUT ROUTE 

app.put("/genres/:id", function(req, res){
    console.log("here in put")
    Blog.findByIdAndUpdate(req.params.id, req.body.genre, function(err, updatedBlog){
        if(err){
            res.redirect("/genres");
        }else{
            res.redirect("/genres/"+req.params.id);
        }
    });
});
        
//Function to get the link for youtube iframe embed.
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