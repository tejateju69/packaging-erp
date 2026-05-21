const express = require("express")

const router = express.Router()

const {

  saveItem,

  getSavedItems,

  deleteSavedItem,

} = require(

  "../controllers/savedItemController"

)

// SAVE ITEM

router.post("/", saveItem)

// GET ITEMS

router.get("/", getSavedItems)

// DELETE ITEM

router.delete("/:id", deleteSavedItem)

module.exports = router