import axios from "axios"

import jsPDF from "jspdf"

import autoTable from "jspdf-autotable"

import { useState, useEffect } from "react"

import DashboardLayout from "../components/DashboardLayout"

import { Plus } from "lucide-react"

export default function Reels() {

  const [singlePopup, setSinglePopup] = useState(false)

  const [multiplePopup, setMultiplePopup] = useState(false)

  const [editPopup, setEditPopup] = useState(false)


  const [reels, setReels] = useState([])
  const [soldReels, setSoldReels] = useState([])

  const [selectedReels, setSelectedReels] = useState([])
  const [searchSize, setSearchSize] = useState("")

  const [singleSize, setSingleSize] = useState("")
  const [singleWeight, setSingleWeight] = useState("")

  const [multipleSize, setMultipleSize] = useState("")
  const [multipleWeights, setMultipleWeights] = useState("")

  const [editIndex, setEditIndex] = useState(null)

  const [editSize, setEditSize] = useState("")
  const [editWeight, setEditWeight] = useState("")
  

useEffect(() => {

  localStorage.setItem(
    "soldReels",
    JSON.stringify(soldReels)
  )

}, [soldReels])

useEffect(() => {

  fetchReels()

}, [])

  // ADD SINGLE REEL

 const handleAddSingleReel = async () => {

    if (!singleSize || !singleWeight) return

    const parts = singleSize.split("x")

    if (parts.length !== 3) {
      alert("Invalid format. Use 69x140x18")
      return
    }

    const [size, gsm, bf] = parts

    try {

  await axios.post(

    "http://127.0.0.1:8000/api/reels",

    {

      reelSize: Number(size),

      gsm: Number(gsm),

      bf: Number(bf),

      weight: Number(singleWeight),

    }

  )

  fetchReels()

  setSingleSize("")

  setSingleWeight("")

  setSinglePopup(false)

}

catch (error) {

  console.log(error)

}
  }

  // ADD MULTIPLE REELS

const handleAddMultipleReels = async () => {
    if (!multipleSize || !multipleWeights) return

    const parts = multipleSize.split("x")
    if (parts.length !== 3) {
      alert("Invalid format. Use 69x140x18")
      return
    }

    const [size, gsm, bf] = parts
    const weightsArray = multipleWeights
      .split("\n")
      .map((w) => w.trim())
      .filter((w) => w !== "")

    try {
      for (const weight of weightsArray) {
        await axios.post("http://127.0.0.1:8000/api/reels", {
          reelSize: Number(size),
          gsm: Number(gsm),
          bf: Number(bf),
          weight: Number(weight),
        })
      }
      fetchReels()
      setMultipleSize("")
      setMultipleWeights("")
      setMultiplePopup(false)
    } catch (error) {
      console.log(error.response?.data)
    }
} // ✅ close handleAddMultipleReels here

// ✅ now handleDeleteReel is its own standalone function
const handleDeleteReel = async (id) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/reels/${id}`)
    fetchReels()
  } catch (error) {
    console.log(error)
  }
}
 
 

  // SELECT CHECKBOX

  const handleSelectReel = (index) => {

    if (selectedReels.includes(index)) {

      setSelectedReels(
        selectedReels.filter((i) => i !== index)
      )

    } else {

      setSelectedReels([...selectedReels, index])

    }
}


  // DELETE SELECTED
const handleDeleteSelected = async () => {

  try {

    const selectedIds = selectedReels.map(

      (index) => reels[index]._id

    )

    for (const id of selectedIds) {

      await axios.delete(

        `http://127.0.0.1:8000/api/reels/${id}`

      )

    }

    fetchReels()

    setSelectedReels([])

  }

  catch (error) {

    console.log(error)

  }

}

  // SELL REEL

  const handleSellReel = (indexToSell) => {

    const reelToSell = reels[indexToSell]

    const updatedReels = reels.filter(
      (_, index) => index !== indexToSell
    )

    setReels(updatedReels)

    setSoldReels([...soldReels, reelToSell])
  }

  // EDIT BUTTON CLICK

  const handleEditClick = (reel, index) => {

    setEditIndex(index)

    setEditSize(
      `${reel.reelSize}x${reel.gsm}x${reel.bf}`
    )

    setEditWeight(reel.weight)

    setEditPopup(true)
  }

  // UPDATE REEL

  const handleUpdateReel = () => {

    const parts = editSize.split("x")

    if (parts.length !== 3) {
      alert("Invalid format")
      return
    }

    const [size, gsm, bf] = parts

    const updatedReels = [...reels]

    updatedReels[editIndex] = {
      reelSize: Number(size),
      gsm: Number(gsm),
      bf: Number(bf),
      weight: Number(editWeight),
    }

    updatedReels.sort((a, b) => a.size - b.size)

    setReels(updatedReels)

    setEditPopup(false)
  }

  const downloadPDF = () => {

  const doc = new jsPDF()

  // TITLE

  doc.setFontSize(22)

  doc.text(
    "Packaging ERP - Reels Report",
    14,
    20
  )

  // DATE

  doc.setFontSize(11)

  doc.text(

    `Generated On: ${new Date().toLocaleString()}`,

    14,

    30
  )

  // AVAILABLE REELS

  doc.setFontSize(16)

  doc.text(
    "Available Reels",
    14,
    45
  )

  autoTable(doc, {

    startY: 50,

    head: [[
      "Size",
      "GSM",
      "BF",
      "Weight"
    ]],

   body: reels.map((reel) => [
  reel.reelSize || "-",
  reel.gsm || "-",
  reel.bf || "-",
  reel.weight || "-"
]),

  })



  // SAVE PDF

  doc.save("Packaging-ERP-Reels.pdf")
}

const filteredReels = reels.filter((reel) => {

  if (!searchSize)
    return true

  return reel.reelSize
    .toString()
    .includes(searchSize)

})

const fetchReels = async () => {

  try {

    const response = await axios.get(

      "http://127.0.0.1:8000/api/reels"

    )

    setReels(response.data)

  }

  catch (error) {

    console.log(error)

  }

} 
  return (
    <DashboardLayout title="Reels Inventory">

      {/* TOP BUTTONS */}

      <div className="flex gap-4 mb-6">

        <button
          onClick={() => setSinglePopup(true)}
          className="bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2"
        >

          <Plus size={18} />

          Add Single Reel

        </button>

        <button
          onClick={() => setMultiplePopup(true)}
          className="bg-green-600 hover:bg-green-700 transition text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2"
        >

          <Plus size={18} />

          Add Multiple Reels

        </button>

      </div>

      <button

  onClick={downloadPDF}

  className="bg-red-500 hover:bg-red-300 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium shadow-sm"
>

  Download PDF

</button>

      {/* AVAILABLE REELS */}

      <div className="bg-white rounded-2xl p-6 shadow-md min-h-[70vh]">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl font-bold text-gray-800">
            Available Reels
          </h2>

          <button
            onClick={handleDeleteSelected}
            className="bg-red-500 hover:bg-red-600 transition text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
          >
            Delete Selected
          </button>

        </div>
        <div className="mb-6">

  <input
    type="text"

    placeholder="Search Reel Size..."

    value={searchSize}

    onChange={(e) =>
      setSearchSize(e.target.value)
    }

    className="w-full max-w-sm border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
  />

</div>

        {/* TABLE HEADER */}

        <div className="grid grid-cols-6 bg-gray-100 rounded-xl px-5 py-3 mb-3">

          <h3 className="text-sm font-bold">
            Select
          </h3>

          <h3 className="text-sm font-bold">
            Size
          </h3>

          <h3 className="text-sm font-bold">
            GSM
          </h3>

          <h3 className="text-sm font-bold">
            BF
          </h3>

          <h3 className="text-sm font-bold">
            Weight
          </h3>

          <h3 className="text-sm font-bold">
            Actions
          </h3>

        </div>

        {/* TABLE ROWS */}

        {
          filteredReels.map((reel, index) => (

            <div
              key={index}
              className="grid grid-cols-6 items-center border-b border-gray-200 px-5 py-4"
            >

              <input
                type="checkbox"
                checked={selectedReels.includes(index)}
                onChange={() => handleSelectReel(index)}
                className="w-4 h-4"
              />

              <p className="text-sm">
                {reel.reelSize}
              </p>

              <p className="text-sm">
                {reel.gsm}
              </p>

              <p className="text-sm">
                {reel.bf}
              </p>

              <p className="text-sm">
                {reel.weight}
              </p>

              <div className="flex gap-2">

                <button
                  onClick={() => handleEditClick(reel, index)}
                  className="bg-yellow-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteReel(reel._id)}
                  className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                >
                  Delete
                </button>

                <button
                  onClick={() => handleSellReel(index)}
                  className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                >
                  Sell
                </button>

              </div>

            </div>

          ))
        }

      </div>

      {/* SOLD REELS */}

      <div className="bg-white rounded-2xl p-6 shadow-md mt-6">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Sold Reels
        </h2>

        <div className="grid grid-cols-4 bg-gray-100 rounded-xl px-5 py-3 mb-3">

          <h3 className="text-sm font-bold">
            Size
          </h3>

          <h3 className="text-sm font-bold">
            GSM
          </h3>

          <h3 className="text-sm font-bold">
            BF
          </h3>

          <h3 className="text-sm font-bold">
            Weight
          </h3>

        </div>

        {
          soldReels.map((reel, index) => (

            <div
              key={index}
              className="grid grid-cols-4 border-b border-gray-200 px-5 py-4"
            >

              <p className="text-sm">
                {reel.reelSize}
              </p>

              <p className="text-sm">
                {reel.gsm}
              </p>

              <p className="text-sm">
                {reel.bf}
              </p>

              <p className="text-sm">
                {reel.weight}
              </p>

            </div>

          ))
        }

      </div>

      {/* SINGLE POPUP */}

      {
        singlePopup && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">

              <h2 className="text-2xl font-bold mb-6">
                Add Single Reel
              </h2>

              <div className="space-y-4">

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Size
                  </label>

                  <input
                    type="text"
                    placeholder="69x140x18"
                    value={singleSize}
                    onChange={(e) => setSingleSize(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Weight
                  </label>

                  <input
                    type="number"
                    placeholder="Enter weight"
                    value={singleWeight}
                    onChange={(e) => setSingleWeight(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

              </div>

              <div className="flex gap-3 mt-6">

                <button
                  onClick={handleAddSingleReel}
                  className="bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
                >
                  Add Reel
                </button>

                <button
                  onClick={() => setSinglePopup(false)}
                  className="bg-gray-300 text-black text-sm font-semibold px-5 py-2.5 rounded-xl"
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        )
      }

      {/* MULTIPLE POPUP */}

      {
        multiplePopup && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl">

              <h2 className="text-2xl font-bold mb-6">
                Add Multiple Reels
              </h2>

              <div className="space-y-4">

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Size
                  </label>

                  <input
                    type="text"
                    placeholder="69x140x18"
                    value={multipleSize}
                    onChange={(e) => setMultipleSize(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Weights
                  </label>

                  <textarea
                    rows="5"
                    value={multipleWeights}
                    onChange={(e) => setMultipleWeights(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
                  />

                </div>

              </div>

              <div className="flex gap-3 mt-6">

                <button
                  onClick={handleAddMultipleReels}
                  className="bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
                >
                  Add Reels
                </button>

                <button
                  onClick={() => setMultiplePopup(false)}
                  className="bg-gray-300 text-black text-sm font-semibold px-5 py-2.5 rounded-xl"
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        )
      }

      {/* EDIT POPUP */}

      {
        editPopup && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">

              <h2 className="text-2xl font-bold mb-6">
                Edit Reel
              </h2>

              <div className="space-y-4">

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Size
                  </label>

                  <input
                    type="text"
                    value={editSize}
                    onChange={(e) => setEditSize(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-500"
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Weight
                  </label>

                  <input
                    type="number"
                    value={editWeight}
                    onChange={(e) => setEditWeight(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-500"
                  />

                </div>

              </div>

              <div className="flex gap-3 mt-6">

                <button
                  onClick={handleUpdateReel}
                  className="bg-yellow-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
                >
                  Update Reel
                </button>

                <button
                  onClick={() => setEditPopup(false)}
                  className="bg-gray-300 text-black text-sm font-semibold px-5 py-2.5 rounded-xl"
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        )
      }

    </DashboardLayout>
  )
}