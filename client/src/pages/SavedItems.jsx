import axios from "axios"

import { useEffect, useState } from "react"

import DashboardLayout from "../components/DashboardLayout"

export default function SavedItems() {

  const [savedItems, setSavedItems] = useState([])
  const [openIndex, setOpenIndex] = useState(null)


  // DELETE ITEM

  const handleDelete = async (id) => {

  try {

    await axios.delete(

      `http://127.0.0.1:8000/api/saved-items/${id}`

    )

    fetchSavedItems()

  }

  catch (error) {

    console.log(error)

  }

}

const fetchSavedItems = async () => {

  try {

    const response = await axios.get(

      "http://127.0.0.1:8000/api/saved-items"

    )

    setSavedItems(response.data)

  }

  catch (error) {

    console.log(error)

  }

}

useEffect(() => {

  fetchSavedItems()

}, [])

  return (

    <DashboardLayout title="Saved Items">

      <div className="space-y-6">

        {
          savedItems.length > 0 ? (

            savedItems.map((item, index) => (

              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
              >

                {/* HEADER */}

                <div className="flex items-center justify-between mb-6">

                  <div>

                    <h2 className="text-2xl font-bold text-gray-800">

                      {item.companyName}

                    </h2>

                    <p className="text-gray-500 mt-1">

                      {item.itemName}

                    </p>

                  </div>

                 <div className="flex gap-3">

  <button

    onClick={() => {

      if (openIndex === index) {

        setOpenIndex(null)

      } else {

        setOpenIndex(index)

      }

    }}

    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl"
  >

    {
      openIndex === index
      ? "Close"
      : "View"
    }

  </button>

  <button

    onClick={() =>
      handleDelete(item._id)
    }

    className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl"
  >

    Delete

  </button>

</div>

                </div>

                {
  openIndex === index && (

    (item.allCases || (item.caseData ? [item.caseData] : [])).map((caseItem, caseIndex) => (

    <div
      key={caseIndex}
      className="border rounded-2xl p-5 mt-6"
    >

      {/* CASE HEADER */}

      <div className="flex items-center justify-between mb-5">

        <div>

          <h3 className="text-xl font-bold text-gray-800">

            {caseItem.name}

          </h3>

          <p className="text-gray-500 text-sm mt-1">

            {
              caseItem.name === "Case 1A"
              ? "Single Piece"

              : caseItem.name === "Case 1B"
              ? "Two Piece"

              : caseItem.name === "Case 2"
              ? "Single Up"

              : "Double Up"
            }

          </p>

        </div>

        {/* COPY */}

        <button

          onClick={() => {

            const text = `

${caseItem.name}

Size : ${item.boxSize}

Boxes : ${item.boxCount}

Ply : ${item.ply}

Gaze : ${caseItem.gaze}

Deckle : ${caseItem.deckle}

Paper Cutting : ${caseItem.pc}

Liner : ${caseItem.liner}

${
  caseItem.weight.sameGsm

  ? `${item.ply} Ply :
${caseItem.deckle} × ${item.topGsm} × 18
- ${caseItem.weight.total}`

  :

`Top :
${caseItem.deckle} × ${item.topGsm} × 18
- ${caseItem.weight.top}

${caseItem.weight.innerPly} Ply :
${caseItem.deckle} × ${item.innerGsm} × 18
- ${caseItem.weight.inner}

Total Weight :
${caseItem.weight.total}`
}

`

            navigator.clipboard.writeText(text)

            alert("Copied Successfully")

          }}

          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm"
        >

          Copy

        </button>

      </div>

      {/* DETAILS */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-base">

        <p>
          <span className="font-semibold">
            Size:
          </span>{" "}
          {item.boxSize}
        </p>

        <p>
          <span className="font-semibold">
            Boxes:
          </span>{" "}
          {item.boxCount}
        </p>

        <p>
          <span className="font-semibold">
            Ply:
          </span>{" "}
          {item.ply}
        </p>

        <p>
          <span className="font-semibold">
            Gaze:
          </span>{" "}
          {caseItem.gaze}
        </p>

        <p>
          <span className="font-semibold">
            Deckle:
          </span>{" "}
          {caseItem.deckle}
        </p>

        <p>
          <span className="font-semibold">
            Paper Cutting:
          </span>{" "}
          {caseItem.pc}
        </p>

        <p>
          <span className="font-semibold">
            Liner:
          </span>{" "}
          {caseItem.liner}
        </p>

      </div>

      {/* WEIGHT */}

      <div className="mt-5 pt-5 border-t">

        {
          caseItem.weight.sameGsm ? (

            <p>

              {item.ply} Ply :

              {" "}

              {caseItem.deckle}

              {" × "}

              {item.topGsm}

              {" × 18"}

              {" - "}

              {caseItem.weight.total}

            </p>

          ) : (

            <div className="space-y-2">

              <p>

                Top :

                {" "}

                {caseItem.deckle}

                {" × "}

                {item.topGsm}

                {" × 18"}

                {" - "}

                {caseItem.weight.top}

              </p>

              <p>

                {caseItem.weight.innerPly}
                {" Ply : "}

                {caseItem.deckle}

                {" × "}

                {item.innerGsm}

                {" × 18"}

                {" - "}

                {caseItem.weight.inner}

              </p>

              <p className="font-semibold text-blue-600">

                Total Weight :
                {" "}

                {caseItem.weight.total}

              </p>

            </div>

          )
        }

     </div>

      {/* DIAGRAM */}

      <div className="mt-5 pt-5 border-t">

        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Diagram
        </h3>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 overflow-x-auto">

          <pre className="text-sm font-mono text-gray-700 whitespace-pre">
            {caseItem.diagram}
          </pre>

        </div>

      </div>

    </div>

  ))
)
}


{/* DATE */}

<div className="mt-6 text-sm text-gray-400">

  Saved On :
  {" "}

  {item.createdAt}

</div>

               

                

                

              </div>

            ))

          ) : (

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center text-gray-500 text-lg">

              No Saved Items Found

            </div>

          )
        }

      </div>

    </DashboardLayout>

  )
}