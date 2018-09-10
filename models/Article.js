var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
  
  title: {
    type: String,
    unique: true
  },
  img:String,
  summary: String,
  link:  String,
  saved: {
    type: Boolean,
    default: false
  },
  Comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

var Article =  mongoose.model('Article', articleSchema);

module.exports = Article;