import { useState } from "react"
import Swal from "sweetalert2"

import {
  NavLink,
  useNavigate,
} from "react-router-dom"

import {
  Menu,
  X,
  House,
  Package,
  Boxes,
  Save,
  ChartNoAxesColumn,
  LogOut,
} from "lucide-react"

export default function DashboardLayout({
  title,
  children,
}) {

  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navigate = useNavigate()

  // LOGOUT FUNCTION

  const handleLogout = () => {

  Swal.fire({

    title: "Logout?",

    text: "Are you sure you want to logout?",

    icon: "warning",

    showCancelButton: true,

    confirmButtonColor: "#DC2626",

    cancelButtonColor: "#2563EB",

    confirmButtonText: "Logout",

  })

  .then((result) => {

    if (result.isConfirmed) {

      // CLEAR LOGIN

      localStorage.removeItem("isLoggedIn")

      sessionStorage.removeItem("isLoggedIn")

      // SUCCESS POPUP

      Swal.fire({

        icon: "success",

        title: "Logged Out",

        text: "Logout Successful",

        timer: 1500,

        showConfirmButton: false,

      })

      // REDIRECT

      setTimeout(() => {

        navigate("/")

      }, 1500)

    }

  })



    // CLEAR LOGIN

    localStorage.removeItem("isLoggedIn")

    sessionStorage.removeItem("isLoggedIn")

    // REDIRECT LOGIN PAGE

    navigate("/")

  }

  return (

    <div className="min-h-screen bg-[#F3F4F6] flex overflow-hidden">

      {/* SIDEBAR */}

      <div
        className={`
          fixed top-0 left-0 h-full w-[260px]
          bg-[#111827]
          text-white
          z-50
          transform transition-transform duration-300 ease-in-out
          shadow-2xl
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        {/* HEADER */}

        <div className="flex items-center justify-between p-5 border-b border-gray-700">

          <div>

            <h1 className="text-2xl font-bold leading-tight">
              Packaging ERP
            </h1>

            <p className="text-gray-400 text-sm mt-1">
              Production System
            </p>

          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="hover:bg-gray-700 p-2 rounded-lg transition"
          >
            <X size={22} />
          </button>

        </div>

        {/* MENU */}

        <div className="flex flex-col gap-2 p-4 mt-4">

          {/* HOME */}

          <NavLink
            to="/home"

            className={({ isActive }) =>

              `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition

              ${
                isActive
                ? "bg-blue-600 shadow-lg"
                : "hover:bg-gray-800"
              }`
            }
          >

            <House size={20} />

            Home

          </NavLink>

          {/* REELS */}

          <NavLink
            to="/reels"

            className={({ isActive }) =>

              `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition

              ${
                isActive
                ? "bg-blue-600 shadow-lg"
                : "hover:bg-gray-800"
              }`
            }
          >

            <Package size={20} />

            Reels

          </NavLink>

          {/* BOX CALCULATION */}

          <NavLink
            to="/box-calculation"

            className={({ isActive }) =>

              `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition

              ${
                isActive
                ? "bg-blue-600 shadow-lg"
                : "hover:bg-gray-800"
              }`
            }
          >

            <Boxes size={20} />

            Box Calculation

          </NavLink>

          {/* SAVED ITEMS */}

          <NavLink
            to="/saved-items"

            className={({ isActive }) =>

              `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition

              ${
                isActive
                ? "bg-blue-600 shadow-lg"
                : "hover:bg-gray-800"
              }`
            }
          >

            <Save size={20} />

            Saved Items

          </NavLink>

          {/* REPORTS */}

          <NavLink
            to="/reports"

            className={({ isActive }) =>

              `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition

              ${
                isActive
                ? "bg-blue-600 shadow-lg"
                : "hover:bg-gray-800"
              }`
            }
          >

            <ChartNoAxesColumn size={20} />

            Reports

          </NavLink>

          {/* LOGOUT */}

          <button

            onClick={handleLogout}

            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition bg-red-500 hover:bg-red-600 mt-6"
          >

            <LogOut size={20} />

            Logout

          </button>

        </div>

      </div>

      {/* MAIN CONTENT */}

      <div
        className={`
          flex-1 transition-all duration-300
          ${sidebarOpen ? "ml-[260px]" : "ml-0"}
        `}
      >

        {/* NAVBAR */}

        <div className="bg-white h-20 shadow-sm flex items-center px-6 gap-4">

          <button
            onClick={() => setSidebarOpen(true)}
            className="bg-[#111827] text-white p-3 rounded-xl shadow-lg hover:scale-105 transition"
          >

            <Menu size={22} />

          </button>

          <div>

            <h1 className="text-2xl font-bold text-gray-800">

              {title}

            </h1>

            <p className="text-sm text-gray-500 mt-1">

              Packaging ERP Dashboard

            </p>

          </div>

        </div>

        {/* PAGE CONTENT */}

        <div className="p-6">

          {children}

        </div>

      </div>

    </div>

  )
}