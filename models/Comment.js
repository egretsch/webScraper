var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  title: String,
  comment: String
});

var Comment = module.exports = mongoose.model('Comment', commentSchema);