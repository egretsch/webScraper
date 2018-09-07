
const request = require('request');
let db = require("../models");
let cheerio = require('cheerio');
var express = require("express");
var router = express.Router();

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
  request("http://www.foxnews.com/world.html", function(err, response, html) {
    console.log("hello from inside request");
    var titleArray = [];
    var linkArray = [];
    var newsArray = [];
    

    var $ = cheerio.load(html);
    $(".article").each(function(i, element) {
      var newsObj = {};
      var title = $(element).children().find($(".title")).find($("a")).text();
      var link = $(element).children().find($(".title")).find($("a")).attr("href");
      var img = $(element).children().find($(".m")).find($("img")).attr("src");
      // console.log(title);
      titleArray.push(title);
      linkArray.push(link);

      function fixLink(link){

        if(link){
          var linkArr = link.split("");

          if (linkArr[0] === "/") {
            return "http://www.foxnews.com" + link;
          }

          return link;
        }

        return "no link available"
       

        // console.log(linkArr);
      }

      fixLink(link);

      newsObj.title = title;
      newsObj.link = fixLink(link);
      newsObj.img = img;
      newsArray.push(newsObj)
    })

    console.log(newsArray);
  })
})

module.exports = router;
