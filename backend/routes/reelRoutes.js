const express = require("express")

const router = express.Router()

const {

  addReel,

  getReels,

  deleteReel,

} = require("../controllers/reelController")

// ADD REEL

router.post("/", addReel)

// GET REELS

router.get("/", getReels)

// DELETE REEL

router.delete("/:id", deleteReel)

module.exports = router