const mongoose = require('mongoose')
const { Schema } = mongoose

const reviewShcema = new Schema({
  body: String,
  rating: Number,
})

module.exports = mongoose.model('Review', reviewShcema)
