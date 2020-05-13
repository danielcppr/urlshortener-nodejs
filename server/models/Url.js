const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  urlCode: String,
  longUrl: String,
  shortUrl: String,
  date: String,
  longUrlSize: Number,
  shortUrlSize: Number
})

module.exports = mongoose.model('Url', urlSchema);
