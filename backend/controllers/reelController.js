const Reel = require("../models/Reel")

// ADD REEL

const addReel = async (req, res) => {

  try {

    const {

      reelSize,

      gsm,

      bf,

      weight,

    } = req.body

    const reel = await Reel.create({

      reelSize,

      gsm,

      bf,

      weight,

    })

    res.status(201).json(reel)

  }

  catch (error) {

    res.status(500).json({

      message: error.message,

    })

  }

}

// GET REELS

const getReels = async (req, res) => {

  try {

    const reels = await Reel.find()

    res.status(200).json(reels)

  }

  catch (error) {

    res.status(500).json({

      message: error.message,

    })

  }

}

// DELETE REEL

const deleteReel = async (req, res) => {

  try {

    await Reel.findByIdAndDelete(

      req.params.id

    )

    res.status(200).json({

      message: "Reel Deleted",

    })

  }

  catch (error) {

    res.status(500).json({

      message: error.message,

    })

  }

}

module.exports = {

  addReel,

  getReels,

  deleteReel,

}