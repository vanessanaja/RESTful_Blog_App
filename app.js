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
        res.render("index.ejs");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running!")
})