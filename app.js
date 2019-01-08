const express    = require("express"),
      app        = express(),
      bodyParser = require("body-parser"),
      mongoose    = require("mongoose");
      
//App Config
mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//Mongoose/Model Config
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

const Blog = mongoose.model("Blog", blogSchema);

//RESTFul Routes

app.get("/blogs", function(req, res){
        Blog.find({}, function(err, blogs){
            if(err){
                console.log(err);
            } else {
                res.render("index.ejs", {blogs: blogs});
            }
        });
});

app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs/new", function(req, res){
   res.render("new"); 
});

app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
       if(err){
           alert("something went wrong, please try again");
           res.render("new");
       } else {
           res.redirect("/blogs");
       }
    });
});

app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       } else {
           res.render("show", {blog: foundBlog});
       }
   });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running!")
})