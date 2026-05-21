const SavedItem = require("../models/SavedItem")

// SAVE ITEM

const saveItem = async (req, res) => {

  try {

    const item = await SavedItem.create(

      req.body

    )

    res.status(201).json(item)

  }

  catch (error) {

    res.status(500).json({

      message: error.message,

    })

  }

}

// GET ITEMS

const getSavedItems = async (req, res) => {

  try {

    const items = await SavedItem.find()

    res.status(200).json(items)

  }

  catch (error) {

    res.status(500).json({

      message: error.message,

    })

  }

}

// DELETE ITEM

const deleteSavedItem = async (req, res) => {

  try {

    await SavedItem.findByIdAndDelete(

      req.params.id

    )

    res.status(200).json({

      message: "Saved Item Deleted",

    })

  }

  catch (error) {

    res.status(500).json({

      message: error.message,

    })

  }

}

module.exports = {

  saveItem,

  getSavedItems,

  deleteSavedItem,

}