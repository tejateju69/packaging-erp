import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Reels from "./pages/Reels"
import BoxCalculation from "./pages/BoxCalculation"
import SavedItems from "./pages/SavedItems"
import Reports from "./pages/Reports"
function ProtectedRoute({ children }) {

  const isLoggedIn =
    localStorage.getItem("isLoggedIn") ||
    sessionStorage.getItem("isLoggedIn")

  return isLoggedIn
    ? children
    : <Navigate to="/" replace />
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}/>

        <Route path="/reels" element={<ProtectedRoute><Reels /></ProtectedRoute>} />

        <Route
          path="/box-calculation"
          element={<ProtectedRoute><BoxCalculation /></ProtectedRoute >}
        />

        <Route
          path="/saved-items"
          element={<ProtectedRoute><SavedItems /></ProtectedRoute>}
        />

        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute >} />

      </Routes>

    </BrowserRouter>
  )
}

export default App