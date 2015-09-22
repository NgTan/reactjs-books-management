var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Books = new Schema({
  name: String,
  author: String,
  publisher: String,
  date: Date,
  pages: Number,
  read: Boolean
});

module.exports = mongoose.model('Books', Books);

mongoose.connect('mongodb://demo:demo@ds041623.mongolab.com:41623/demo', function (error, res) {
  console.log(error ? error : res);
});
