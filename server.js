const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(expressLayouts);




// Connect to the Mongo DB
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoReddit";
mongoose.set('useFindAndModify', false);
mongoose.connect(MONGODB_URI);

// Routes
app.get("/", function(req, res) {
  res.render('index');
});

app.get('/saving', function (req, res) {
  res.render('saved')
})

// A GET route for scraping the invision blog
app.get("/scrape", function(req, res) {
    axios.get("https://old.reddit.com/r/webdev/").then(function (response) {
    let $ = cheerio.load(response.data)
    $('p.title').each(function(i, element) {
      let title = $(element).text();
      let link = $(element).children().attr('href');
      let result = {
        title,
        link
      }
      
      console.log("blah" + result);
      
      db.Post.findOne({title}).then(function(data) {

        if(data === null) {
          db.Post.create(result).then(function(dbPost) {
            res.json(dbPost);
          });
        }
      }).catch(function(err) {
          res.json(err);
      });

    });

  });
});

app.get("/Posts", function(req, res) {
  
  db.Post
    .find({})
    .then(function(dbPost) {
      res.json(dbPost);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/Posts/:id", function(req, res) {

  db.Post
    .findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbPost) {
      res.json(dbPost);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/Posts/:id", function(req, res) {

  db.Note
    .create(req.body)
    .then(function(dbNote) {
      return db.Post.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbPost) {
      res.json(dbPost);
    })
    .catch(function(err) {
      res.json(err);
    });
});


app.put("/saved/:id", function(req, res) {

  db.Post
    .findByIdAndUpdate({ _id: req.params.id }, { $set: { isSaved: true }})
    .then(function(dbPost) {
      res.json(dbPost);
    })
    .catch(function(err) {
      res.json(err);
    });
});



app.get("/saved", function(req, res) {

  db.Post
    .find({ isSaved: true })
    .then(function(dbPost) {
      res.json(dbPost);
    })
    .catch(function(err) {
      res.json(err);
    });
});


app.put("/delete/:id", function(req, res) {

  db.Post
    .findByIdAndUpdate({ _id: req.params.id }, { $set: { isSaved: false }})
    .then(function(dbPost) {
      res.json(dbPost);
    })
    .catch(function(err) {
      res.json(err);
    });
});




app.listen(PORT, function() {
  console.log("listening" + PORT);
});
