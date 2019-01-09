const express    = require("express"),
      app        = express(),
      bodyParser = require("body-parser"),
      mongoose    = require("mongoose"),
      expressSanitizer = require('express-sanitizer'),
      methodOverride = require("method-override");
      
//App Confige
mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer()); 
app.use(methodOverride("_method"));

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
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, function(err, newBlog){
       if(err){
           alert("something went wrong, please try again");
           res.render("new");
       } else {
           res.redirect("/blogs");
       }
    });
});

app.post('/', function(req, res, next) {
  // replace an HTTP posted body property with the sanitized string
  req.body.sanitized = req.sanitize(req.body.blog);
  // send the response
  res.send('Your value was sanitized to: ' + req.body.sanitized);
});

// router.post('/', function(req, res, next) {
//   // replace an HTTP posted body property with the sanitized string
//   req.body.sanitized = req.sanitize(req.body.propertyToSanitize);
//   // send the response
//   res.send('Your value was sanitized to: ' + req.body.sanitized);
// });

app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       } else {
           res.render("show", {blog: foundBlog});
       }
   });
});

// EDIT Route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog}); 
        }
    });
});

//UPDATE Route

app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running!")
})