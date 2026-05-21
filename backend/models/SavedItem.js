const mongoose = require("mongoose")

const savedItemSchema = new mongoose.Schema({

  companyName: {

    type: String,

    required: true,

  },

  itemName: {

    type: String,

    required: true,

  },

  allCases: {

    type: Array,

    required: true,

  },

  boxSize: {

    type: String,

    required: true,

  },

  boxCount: {

    type: String,

    required: true,

  },

  ply: {

    type: String,

    required: true,

  },

  topGsm: {

    type: String,

    required: true,

  },

  innerGsm: {

    type: String,

    required: true,

  },

  createdAt: {

    type: Date,

    default: Date.now,

  },

})

module.exports = mongoose.model(

  "SavedItem",

  savedItemSchema

)