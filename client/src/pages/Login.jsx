import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

export default function Login() {

  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  // REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    if (
      localStorage.getItem("isLoggedIn") ||
      sessionStorage.getItem("isLoggedIn")
    ) {
      navigate("/home", { replace: true })
    }
  }, [navigate])

  const handleLogin = async () => {

  try {

  const response = await axios.post(

    "https://sp-packaging.onrender.com/api/auth/login",

    {

      username,

      password,

    }

  )

  // STORE TOKEN

  localStorage.setItem(

    "token",

    response.data.token

  )

  // LOGIN STATE

  if (rememberMe) {

    localStorage.setItem(

      "isLoggedIn",

      "true"

    )

  }

  else {

    sessionStorage.setItem(

      "isLoggedIn",

      "true"

    )

  }

  // SUCCESS POPUP

  Swal.fire({

    icon: "success",

    title: "Login Successful",

    timer: 1500,

    showConfirmButton: false,

  })

  // REDIRECT

  setTimeout(() => {

    navigate("/home")

  }, 1500)

}

catch (error) {

  Swal.fire({

    icon: "error",

    title: "Login Failed",

    text:

      error.response?.data?.message ||

      "Invalid Credentials",

  })

}
  }

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-black text-white items-center justify-center p-6">
        <div>
          <h1 className="text-7xl font-bold leading-tight mb-6">
            Packaging
            <br />
            ERP
          </h1>
          <p className="text-2xl text-gray-300 max-w-lg leading-relaxed">
            Production, Reel Inventory, Box Calculation and Weight Management System.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center px-6">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8">

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-black mb-3">
              Login
            </h2>
            <p className="text-gray-500 text-xl">
              Access your account
            </p>
          </div>

          <div className="space-y-8">

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl px-6 py-5 text-xl outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl px-6 py-5 text-xl outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4"
              />
              <p className="text-sm text-gray-600">
                Remember Me
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-black text-white py-5 rounded-2xl text-xl font-semibold hover:bg-gray-800 transition"
            >
              Login
            </button>

          </div>

        </div>
      </div>

    </div>
  )
}