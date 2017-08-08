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

Blog.create({
    
});


//RESTFUL ROUTES



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running!");
});