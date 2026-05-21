const User = require("../models/User")

const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")

// REGISTER USER

const registerUser = async (req, res) => {

  try {

    const {

      username,

      password,

    } = req.body

    // CHECK EXISTING USER

    const existingUser =

      await User.findOne({ username })

    if (existingUser) {

      return res.status(400).json({

        message: "User Already Exists",

      })

    }

    // HASH PASSWORD

    const salt = await bcrypt.genSalt(10)

    const hashedPassword =

      await bcrypt.hash(password, salt)

    // CREATE USER

    const user = await User.create({

      username,

      password: hashedPassword,

    })

    res.status(201).json({

      message: "User Registered",

      user,

    })

  }

  catch (error) {

    res.status(500).json({

      message: error.message,

    })

  }

}

// LOGIN USER

const loginUser = async (req, res) => {

  try {

    const {

      username,

      password,

    } = req.body

    // FIND USER

    const user = await User.findOne({

      username,

    })

    if (!user) {

      return res.status(400).json({

        message: "Invalid Username",

      })

    }

    // CHECK PASSWORD

    const isMatch = await bcrypt.compare(

      password,

      user.password

    )

    if (!isMatch) {

      return res.status(400).json({

        message: "Invalid Password",

      })

    }

    // CREATE TOKEN

    const token = jwt.sign(

      {

        id: user._id,

      },

      process.env.JWT_SECRET,

      {

        expiresIn: "7d",

      }

    )

    res.status(200).json({

      message: "Login Successful",

      token,

      user: {

        id: user._id,

        username: user.username,

      },

    })

  }

  catch (error) {

    res.status(500).json({

      message: error.message,

    })

  }

}

module.exports = {

  registerUser,

  loginUser,

}