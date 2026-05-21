import axios from "axios"

import { useEffect, useState } from "react"

import DashboardLayout from "../components/DashboardLayout"

export default function Reports() {

  const [reels, setReels] = useState([])

  const [soldReels, setSoldReels] = useState([])

  const [savedItems, setSavedItems] = useState([])

  // LOAD DATA

  useEffect(() => {

    const storedReels =

      JSON.parse(
        localStorage.getItem("reels")
      ) || []

    const storedSoldReels =

      JSON.parse(
        localStorage.getItem("soldReels")
      ) || []

    const storedSavedItems =

      JSON.parse(
        localStorage.getItem("savedItems")
      ) || []

    setReels(storedReels)

    setSoldReels(storedSoldReels)

    setSavedItems(storedSavedItems)

  }, [])

  // TOTAL AVAILABLE WEIGHT

  const totalAvailableWeight =

    reels.reduce(

      (total, reel) =>

        total + Number(reel.weight || 0),

      0
    )

  // TOTAL SOLD WEIGHT

  const totalSoldWeight =

    soldReels.reduce(

      (total, reel) =>

        total + Number(reel.weight || 0),

      0
    )

  // TOTAL CASES

  const totalCases =

  savedItems.reduce(

    (total, item) =>

      total +

      (
        item.allCases
        ? item.allCases.length
        : 0
      ),

    0
  )

const fetchReportsData = async () => {

  try {

    // FETCH REELS

    const reelsResponse = await axios.get(

      "http://127.0.0.1:8000/api/reels"

    )

    setReels(reelsResponse.data)

    // FETCH SAVED ITEMS

    const savedItemsResponse = await axios.get(

      "http://127.0.0.1:8000/api/saved-items"

    )

    setSavedItems(savedItemsResponse.data)

  }

  catch (error) {

    console.log(error)

  }

}

useEffect(() => {

  fetchReportsData()

}, [])

const totalReels = reels.length

const totalSavedItems = savedItems.length

const totalWeight = reels.reduce(

  (total, reel) => total + Number(reel.weight),

  0

)

const totalCompanies = [

  ...new Set(

    savedItems.map(

      (item) => item.companyName

    )

  )

].length

  return (

    <DashboardLayout title="Reports">

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

  {/* TOTAL REELS */}

  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">

    <h3 className="text-lg font-semibold text-gray-500">

      Total Reels

    </h3>

    <p className="text-4xl font-bold text-blue-600 mt-4">

      {totalReels}

    </p>

  </div>

  {/* TOTAL WEIGHT */}

  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">

    <h3 className="text-lg font-semibold text-gray-500">

      Total Weight

    </h3>

    <p className="text-4xl font-bold text-green-600 mt-4">

      {totalWeight}

    </p>

  </div>

  {/* SAVED ITEMS */}

  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">

    <h3 className="text-lg font-semibold text-gray-500">

      Saved Items

    </h3>

    <p className="text-4xl font-bold text-purple-600 mt-4">

      {totalSavedItems}

    </p>

  </div>

  {/* COMPANIES */}

  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">

    <h3 className="text-lg font-semibold text-gray-500">

      Companies

    </h3>

    <p className="text-4xl font-bold text-red-600 mt-4">

      {totalCompanies}

    </p>

  </div>

</div>

      {/* TOP STATS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* AVAILABLE REELS */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">

          <h2 className="text-lg font-semibold text-gray-500">
            Available Reels
          </h2>

          <p className="text-4xl font-bold text-blue-600 mt-3">
            {reels.length}
          </p>

        </div>

        {/* SOLD REELS */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">

          <h2 className="text-lg font-semibold text-gray-500">
            Sold Reels
          </h2>

          <p className="text-4xl font-bold text-green-600 mt-3">
            {soldReels.length}
          </p>

        </div>

        {/* SAVED ITEMS */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">

          <h2 className="text-lg font-semibold text-gray-500">
            Saved Items
          </h2>

          <p className="text-4xl font-bold text-purple-600 mt-3">
            {savedItems.length}
          </p>

        </div>

        {/* COMPANIES */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">

          <h2 className="text-lg font-semibold text-gray-500">
            Companies
          </h2>

          <p className="text-4xl font-bold text-orange-500 mt-3">
            {totalCompanies}
          </p>

        </div>

        {/* TOTAL CASES */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">

          <h2 className="text-lg font-semibold text-gray-500">
            Total Cases
          </h2>

          <p className="text-4xl font-bold text-red-500 mt-3">
            {totalCases}
          </p>

        </div>

        {/* AVAILABLE WEIGHT */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">

          <h2 className="text-lg font-semibold text-gray-500">
            Available Weight
          </h2>

          <p className="text-4xl font-bold text-cyan-600 mt-3">
            {totalAvailableWeight}
          </p>

        </div>

        {/* SOLD WEIGHT */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">

          <h2 className="text-lg font-semibold text-gray-500">
            Sold Weight
          </h2>

          <p className="text-4xl font-bold text-pink-600 mt-3">
            {totalSoldWeight}
          </p>

        </div>

      </div>

      {/* RECENT SAVED ITEMS */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">

          Recent Saved Items

        </h2>

        {
          savedItems.length > 0 ? (

            <div className="space-y-4">

              {
                savedItems.slice(-5).reverse().map((item, index) => (

                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-4 flex items-center justify-between"
                  >

                    <div>

                      <h3 className="text-lg font-semibold text-gray-800">

                        {item.companyName}

                      </h3>

                      <p className="text-gray-500 mt-1">

                        {item.itemName}

                      </p>

                    </div>

                    <div className="text-sm text-gray-400">

                      {item.createdAt}

                    </div>

                  </div>

                ))
              }

            </div>

          ) : (

            <div className="text-gray-500 text-lg">

              No Saved Items Available

            </div>

          )
        }

      </div>

    </DashboardLayout>
  )
}