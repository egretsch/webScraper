
const request = require('request');
let db = require("../models");
let cheerio = require('cheerio');
var express = require("express");
var router = express.Router();
const mongoose = require('mongoose');

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Import the model to use its database functions.


// Create all our routes and set up logic within those routes where required.
router.get("/", function (req, res) {
  
  db.Article
    .find({})
    .then(articles => res.render('index', { articles }))
    .catch(err => res.json(err));
  });

//get route to update 'saved' boolean to true
router.get('/save/:id', (req, res) => {
  db.Article
    .update({ _id: req.params.id }, { $set: { saved: true }})
    .then(result => res.redirect('/'))
    .catch(err => res.json(err));
});

router.get("/savedarticle", function (req, res) {
  console.log("i was clicked")
  db.Article
    .find({})
    .then(articles => res.render('savedArticle', { articles }))
    .catch(err => res.json(err));
  
  

});

router.get("/scraper", function (req, res) {
  
  request("http://www.foxnews.com/world.html", function (err, response, html) {
    console.log("inside of request");
    var newsArray = [];
    var $ = cheerio.load(html);
    $(".article").each(function (i, element) {
      // console.log("inside of scaper");
      var newsObj = {};
      var title = $(element).children().find($(".title")).find($("a")).text();
      var link = $(element).children().find($(".title")).find($("a")).attr("href");
      var summary = $(element).children().find($(".dek")).find($("a")).text();
      var img = $(element).children().find($("img")).attr("src");
      function fixLink(link) {
        if (link) {
          var linkArr = link.split("");
          if (linkArr[0] === "/") {
            return "http://www.foxnews.com" + link;
          }
          return link;
        }
        return "no link available"
      }

      fixLink(link);

      var newsObj = new db.Article({
        title: title,
        img: img,
        summary: summary,
        link: fixLink(link)
      });

      // if (!savedHeadlines.includes(newsObj.title)) {
      newsArray.push(newsObj)
      // }


      db.Article.create(newsArray)
        .then(function (dbArticle) {
          // View the added result in the console
          res.json(dbArticle);
          console.log(dbArticle);
        })


    });
   newFunction(newsArray); 
  });
});

router.delete('/deleteArticle/:id', function (req, res) {
  
  db.Article
    .remove({ _id: req.params.id })
    .then(result => res.json(result))
    .catch(err => res.json(err));
  
});
//get route to retrieve all notes for a particlular article
router.get('/getComment/:id', function (req, res) {
  
  db.Article
    .findOne({ _id: req.params.id })
    .populate('Comments')
    .then(results => {
      console.log(results)
      res.json(results)})
    .catch(err => res.json(err));
});

//get route to return a single note to view it
router.get('/getSingleComment/:id', function (req, res) {
  
  db.Comment
    .findOne({ _id: req.params.id })
    .then(result => {
      console.log(result)
      res.json(result)}) 
    .catch(err => res.json(err));
});

//post route to create a new note in the database
router.post('/createComment', function (req, res) {
  let { title, body, articleId } = req.body;
  let comment = {
    title,
    body
  };
  db.Comment
    .create(comment)
    .then(result => {
      db.Article
        .findOneAndUpdate({ _id: articleId }, { $push: { Comments: result._id } }, { new: true })//saving reference to note in corresponding article
        .then(data => res.json(result))
        .catch(err => res.json(err));
    })
    .catch(err => res.json(err));
});

//post route to delete a note
router.post('/deleteComment', (req, res) => {
  let { articleId, commentId } = req.body;
  console.log(commentId)
  db.Comment
    .remove({ _id: commentId })
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

module.exports = router;


function newFunction(newsArray) {
  console.log(newsArray);
}

