
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
  
  res.render("index", {});
  });


router.get("/savedarticle", function (req, res) {
  // console.log(res);
  res.render("savedArticle", {});

});

router.get("/scraper", function (req, res) {
  console.log("/scraper was hit")
  // db.Article
  //   .find({})
  //   .then((data) => {
  //     let savedHeadlines = data.map(article => article.title);
  //     .then(function () {
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
    

  
  // })
  //   .catch(err => console.log(err)); //end of rp method

  // })
  // .catch(err => console.log(err));
});

module.exports = router;


function newFunction(newsArray) {
  console.log(newsArray);
}

