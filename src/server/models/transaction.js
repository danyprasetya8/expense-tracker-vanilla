const mongoose = require('mongoose')
const Schema = mongoose.Schema

const transaction = new Schema({
  desc: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('Transactions', transaction)