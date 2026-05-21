const mongoose = require("mongoose")

const reelSchema = new mongoose.Schema({

  reelSize: {

    type: Number,

    required: true,

  },

  gsm: {

    type: Number,

    required: true,

  },

  bf: {

    type: Number,

    required: true,

  },

  weight: {

    type: Number,

    required: true,

  },

  status: {

    type: String,

    default: "available",

  },

  createdAt: {

    type: Date,

    default: Date.now,

  },

})

module.exports = mongoose.model(
  "Reel",
  reelSchema
)