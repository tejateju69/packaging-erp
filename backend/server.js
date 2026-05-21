const express = require("express")

const cors = require("cors")

const dotenv = require("dotenv")

const connectDB = require("./config/db")

const authRoutes = require("./routes/authRoutes")

const reelRoutes = require("./routes/reelRoutes")

const savedItemRoutes = require("./routes/savedItemRoutes")

// CONFIG

dotenv.config()

// DATABASE CONNECTION

connectDB()

// EXPRESS APP

const app = express()

// MIDDLEWARE

app.use(cors())

app.use(express.json())

app.use("/api/auth", authRoutes)

app.use("/api/reels", reelRoutes)

app.use("/api/saved-items", savedItemRoutes)
// TEST ROUTE

app.get("/", (req, res) => {

  res.send("Packaging ERP Backend Running")

})

// PORT

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {

  console.log(

    `Server Running On Port ${PORT}`

  )

})