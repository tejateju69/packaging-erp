import axios from "axios"

import { useState, useEffect } from "react"

import DashboardLayout from "../components/DashboardLayout"

export default function BoxCalculation() {

  const [boxSize, setBoxSize] = useState("")
  const [boxCount, setBoxCount] = useState("")
  const [ply, setPly] = useState("3")
  const [topGsm, setTopGsm] = useState("140")
  const [innerGsm, setInnerGsm] = useState("140")

  const [cases, setCases] = useState([])
  const [availableReels, setAvailableReels] = useState([])
  const [showSavePopup, setShowSavePopup] = useState(false)


const [companyName, setCompanyName] = useState("")

const [itemName, setItemName] = useState("")

useEffect(() => {

  fetchReels()

}, [])

  // CALCULATION

  const handleCalculate = async() => {

    // REMOVE SPACES

    const cleanSize =
      boxSize.replace(/\s/g, "")

    // SPLIT

    const parts =
      cleanSize.toLowerCase().split("x")

    // VALIDATION

    if (parts.length !== 3) {

      alert(
        "Enter size in L x B x H format"
      )

      return
    }

    // CONVERT TO NUMBERS

    const length =
      Number(parts[0])

    const width =
      Number(parts[1])

    const height =
      Number(parts[2])

    const totalBoxes =
      Number(boxCount)

    const plyNumber =
      Number(ply)

    // CHECK

    if (
  isNaN(length) ||
  isNaN(width) ||
  isNaN(height) ||
  length <= 0 ||
  width <= 0 ||
  height <= 0
) {
  alert("Invalid box size")
  return
}

// ADD THIS BLOCK RIGHT AFTER
if (isNaN(totalBoxes) || totalBoxes <= 0) {
  alert("Enter a valid number of boxes")
  return
}

    // ---------------- GAZE ----------------
    // FETCH REELS
    let reelsData = []
    try {
      const response = await axios.get("https://sp-packaging.onrender.com/api/reels")
      reelsData = response.data
      setAvailableReels(reelsData)
    } catch (error) {
      console.log(error)
    }

    // ---------------- GAZE ----------------

    let gaze

    let gazeDoubled = false

    if ((length + width) > 900) {

      gaze =
        (length + width) + 50

      gazeDoubled = false

    }

    else {

      gaze =
        ((length + width) * 2) + 50

      gazeDoubled = true
    }

    // ---------------- DECKLE ----------------

    const baseDeckle =
      width + height

    const deckleSingle =
      baseDeckle + 20

    const deckleDouble =
      (baseDeckle * 2) + 20

    // MACHINE LIMIT

    const singlePossible =
      deckleSingle <= 1300

    const doublePossible =
      deckleDouble <= 1300

    // STORE CASES

    const generatedCases = []

    // ======================
    // CASE 1A
    // ======================

    if (
      !gazeDoubled &&
      singlePossible
    ) {

      const deckle =
        Math.ceil(deckleSingle / 10)

      const paperCutting =
        totalBoxes * 2

      let liner = 0

      if (plyNumber === 3) {
        liner = paperCutting * 1
      }

      else if (plyNumber === 5) {
        liner = paperCutting * 2
      }

      else if (plyNumber === 7) {
        liner = paperCutting * 3
      }
      const itemDeckle = deckle
      const weightMultiplier = 2

      const matchingReels = (() => {

  // GROUP BY SIZE
  const grouped = {}

  console.log("reelsData inside matchingReels:", reelsData)  
  console.log("deckle value:", deckle)  

  reelsData.forEach((reel) => {
    if (!reel || !reel.reelSize) return
    if (Number(reel.reelSize) < deckle) return

    const key = `${reel.reelSize}-${reel.gsm}-${reel.bf}`

    if (!grouped[key]) {
      grouped[key] = {
        reelSize: reel.reelSize,
        gsm: reel.gsm,
        bf: reel.bf,
        count: 0,
        weights : []
      }
    }

    grouped[key].count += 1
    grouped[key].weights.push(reel.weight)
  })

  // SORT BY SIZE, TAKE 3 CLOSEST
  return Object.values(grouped)
    .sort((a, b) => Number(a.size) - Number(b.size))
    .slice(0, 3)

})()

      generatedCases.push({

        name: "Case 1A",

        gaze,

        deckle,

        pc: paperCutting,

        liner,
        
        diagram : `
------------------------------
|            |               |
|  Length    |    Width      |
|            |               |
------------------------------
`,
reels: matchingReels,

        weight: (() => {

  // ---------------- SAME GSM ----------------

  if (topGsm === innerGsm) {

    const plyFactors = {
      3: 3.4,
      5: 5.8,
      7: 8.2,
    }

    const factor =
      plyFactors[plyNumber]

    let totalWeight =

      itemDeckle *
      Number(topGsm) *
      gaze *
      factor

    // ADD 3%

    totalWeight =
      totalWeight +
      (totalWeight * 3 / 100)

    // DIVIDE

    totalWeight =
  (totalWeight / 100000000)
  * weightMultiplier

    return {

      sameGsm: true,

      total:
        totalWeight.toFixed(2)

    }
  }

  // ---------------- DIFFERENT GSM ----------------

  else {

    const innerPly =
      plyNumber - 1

    const plyFactors = {
      2: 2.4,
      3: 3.4,
      4: 4.8,
      5: 5.8,
      6: 7.2,
      7: 8.2,
    }

    const innerFactor =
      plyFactors[innerPly]

    // TOP

    let topWeight =

      itemDeckle *
      Number(topGsm) *
      gaze *
      1

    topWeight =
      topWeight +
      (topWeight * 3 / 100)

    topWeight =
  (topWeight / 100000000)
  * weightMultiplier

    // INNER

    let innerWeight =

      itemDeckle *
      Number(innerGsm) *
      gaze *
      innerFactor

    innerWeight =
      innerWeight +
      (innerWeight * 3 / 100)

    innerWeight =
  (innerWeight / 100000000)
  * weightMultiplier

    // TOTAL

    const total =
      topWeight + innerWeight

    return {

      sameGsm: false,

      top:
        topWeight.toFixed(2),

      inner:
        innerWeight.toFixed(2),

      total:
        total.toFixed(2),

      innerPly

    }
  }

})(),

      })
    }

    // ======================
    // CASE 1B
    // ======================

    if (
      !gazeDoubled &&
      doublePossible
    ) {

      const deckle =
        Math.ceil(deckleDouble / 10)

      const paperCutting =
        totalBoxes

      let liner = 0

      if (plyNumber === 3) {
        liner = paperCutting * 1
      }

      else if (plyNumber === 5) {
        liner = paperCutting * 2
      }

      else if (plyNumber === 7) {
        liner = paperCutting * 3
      }
      const itemDeckle = deckle
      const weightMultiplier = 1
      const matchingReels = (() => {

  // GROUP BY SIZE
  const grouped = {}

  reelsData.forEach((reel) => {
    if (!reel || !reel.reelSize) return
    if (Number(reel.reelSize) < deckle) return

    const key = `${reel.reelSize}-${reel.gsm}-${reel.bf}`

    if (!grouped[key]) {
      grouped[key] = {
        reelSize: reel.reelSize,
        gsm: reel.gsm,
        bf: reel.bf,
        count: 0,
        weights : []
      }
    }

    grouped[key].count += 1
    grouped[key].weights.push(reel.weight)
  })

  // SORT BY SIZE, TAKE 3 CLOSEST
  return Object.values(grouped)
    .sort((a, b) => Number(a.size) - Number(b.size))
    .slice(0, 3)

})()
      generatedCases.push({

        name: "Case 1B",

        gaze,

        deckle,

        pc: paperCutting,

        liner,

        diagram : `
------------------------------
|            |               |
|  Length    |    Width      |
|            |               |
------------------------------
|            |               |
|  Length    |    Width      |
|            |               |
------------------------------
`,
reels: matchingReels,
        weight: (() => {

  // ---------------- SAME GSM ----------------

  if (topGsm === innerGsm) {

    const plyFactors = {
      3: 3.4,
      5: 5.8,
      7: 8.2,
    }

    const factor =
      plyFactors[plyNumber]

    let totalWeight =

      itemDeckle *
      Number(topGsm) *
      gaze *
      factor

    // ADD 3%

    totalWeight =
      totalWeight +
      (totalWeight * 3 / 100)

    // DIVIDE

    totalWeight =
  (totalWeight / 100000000)
  * weightMultiplier

    return {

      sameGsm: true,

      total:
        totalWeight.toFixed(2)

    }
  }

  // ---------------- DIFFERENT GSM ----------------

  else {

    const innerPly =
      plyNumber - 1

    const plyFactors = {
      2: 2.4,
      3: 3.4,
      4: 4.8,
      5: 5.8,
      6: 7.2,
      7: 8.2,
    }

    const innerFactor =
      plyFactors[innerPly]

    // TOP

    let topWeight =

      itemDeckle *
      Number(topGsm) *
      gaze *
      1

    topWeight =
      topWeight +
      (topWeight * 3 / 100)

    topWeight =
      (topWeight / 100000000)
      * weightMultiplier

    // INNER

    let innerWeight =

      itemDeckle *
      Number(innerGsm) *
      gaze *
      innerFactor

    innerWeight =
      innerWeight +
      (innerWeight * 3 / 100)

    innerWeight =
      (innerWeight / 100000000)
      * weightMultiplier

    // TOTAL

    const total =
      topWeight + innerWeight

    return {

      sameGsm: false,

      top:
        topWeight.toFixed(2),

      inner:
        innerWeight.toFixed(2),

      total:
        total.toFixed(2),

      innerPly

    }
  }

})(),

      })
    }

    // ======================
    // CASE 2
    // ======================

    if (
      gazeDoubled &&
      singlePossible
    ) {

      const deckle =
        Math.ceil(deckleSingle / 10)

      const paperCutting =
        totalBoxes

      let liner = 0

      if (plyNumber === 3) {
        liner = paperCutting * 1
      }

      else if (plyNumber === 5) {
        liner = paperCutting * 2
      }

      else if (plyNumber === 7) {
        liner = paperCutting * 3
      }

      const itemDeckle = deckle
      const weightMultiplier = 1

      const matchingReels = (() => {

  // GROUP BY SIZE
  const grouped = {}

  reelsData.forEach((reel) => {
    if (!reel || !reel.reelSize) return
    if (Number(reel.reelSize) < deckle) return

    const key = `${reel.reelSize}-${reel.gsm}-${reel.bf}`

    if (!grouped[key]) {
      grouped[key] = {
        reelSize: reel.reelSize,
        gsm: reel.gsm,
        bf: reel.bf,
        count: 0,
        weights : []
      }
    }

    grouped[key].count += 1
    grouped[key].weights.push(reel.weight) 
  })

  // SORT BY SIZE, TAKE 3 CLOSEST
  return Object.values(grouped)
    .sort((a, b) => Number(a.size) - Number(b.size))
    .slice(0, 3)

})()
      generatedCases.push({

        name: "Case 2",

        gaze,

        deckle,

        pc: paperCutting,

        liner,

        diagram : `
-------------------------------------------------------
|            |              |            |            |
|  Length    |    Width     |  Length    |    Width   |
|            |              |            |            |
-------------------------------------------------------
`,
reels: matchingReels,
        weight: (() => {

  // ---------------- SAME GSM ----------------

  if (topGsm === innerGsm) {

    const plyFactors = {
      3: 3.4,
      5: 5.8,
      7: 8.2,
    }

    const factor =
      plyFactors[plyNumber]

    let totalWeight =

      itemDeckle *
      Number(topGsm) *
      gaze *
      factor

    // ADD 3%

    totalWeight =
      totalWeight +
      (totalWeight * 3 / 100)

    // DIVIDE

    totalWeight =
      (totalWeight / 100000000)
      * weightMultiplier

    return {

      sameGsm: true,

      total:
        totalWeight.toFixed(2)

    }
  }

  // ---------------- DIFFERENT GSM ----------------

  else {

    const innerPly =
      plyNumber - 1

    const plyFactors = {
      2: 2.4,
      3: 3.4,
      4: 4.8,
      5: 5.8,
      6: 7.2,
      7: 8.2,
    }

    const innerFactor =
      plyFactors[innerPly]

    // TOP

    let topWeight =

      itemDeckle *
      Number(topGsm) *
      gaze *
      1

    topWeight =
      topWeight +
      (topWeight * 3 / 100)

    topWeight =
      (topWeight / 100000000)
      * weightMultiplier

    // INNER

    let innerWeight =

      itemDeckle *
      Number(innerGsm) *
      gaze *
      innerFactor

    innerWeight =
      innerWeight +
      (innerWeight * 3 / 100)

    innerWeight =
      (innerWeight / 100000000)
      * weightMultiplier

    // TOTAL

    const total =
      topWeight + innerWeight

    return {

      sameGsm: false,

      top:
        topWeight.toFixed(2),

      inner:
        innerWeight.toFixed(2),

      total:
        total.toFixed(2),

      innerPly

    }
  }

})(),

      })
    }

    // ======================
    // CASE 3
    // ======================

    if (
      gazeDoubled &&
      doublePossible
    ) {

      const deckle =
        Math.ceil(deckleDouble / 10)

      const paperCutting =
        Math.floor(totalBoxes / 2)

      let liner = 0

      if (plyNumber === 3) {
        liner = paperCutting * 1
      }

      else if (plyNumber === 5) {
        liner = paperCutting * 2
      }

      else if (plyNumber === 7) {
        liner = paperCutting * 3
      }
      const itemDeckle = deckle
      const weightMultiplier = 0.5
      const matchingReels = (() => {

  // GROUP BY SIZE
  const grouped = {}

  reelsData.forEach((reel) => {
    if (!reel || !reel.reelSize) return
    if (Number(reel.reelSize) < deckle) return

    const key = `${reel.reelSize}-${reel.gsm}-${reel.bf}`

    if (!grouped[key]) {
      grouped[key] = {
        reelSize: reel.reelSize,
        gsm: reel.gsm,
        bf: reel.bf,
        count: 0,
        weights: []
      }
    }

    grouped[key].count += 1
    grouped[key].weights.push(reel.weight) 
  })

  // SORT BY SIZE, TAKE 3 CLOSEST
  return Object.values(grouped)
    .sort((a, b) => Number(a.size) - Number(b.size))
    .slice(0, 3)

})()
      generatedCases.push({

        name: "Case 3",

        gaze,

        deckle,

        pc: paperCutting,

        liner,

        diagram : `
-------------------------------------------------------
|            |              |            |             |
|  Length    |    Width     |  Length    |    Width    |
|            |              |            |             |
-------------------------------------------------------
|            |              |            |             |
|  Length    |    Width     |  Length    |    Width    |
|            |              |            |             |
--------------------------------------------------------
        `,
reels: matchingReels,
        weight: (() => {

  // ---------------- SAME GSM ----------------

  if (topGsm === innerGsm) {

    const plyFactors = {
      3: 3.4,
      5: 5.8,
      7: 8.2,
    }

    const factor =
      plyFactors[plyNumber]

    let totalWeight =

      itemDeckle *
      Number(topGsm) *
      gaze *
      factor

    // ADD 3%

    totalWeight =
      totalWeight +
      (totalWeight * 3 / 100)

    // DIVIDE

    totalWeight =
      (totalWeight / 100000000)
      * weightMultiplier

    return {

      sameGsm: true,

      total:
        totalWeight.toFixed(2)

    }
  }

  // ---------------- DIFFERENT GSM ----------------

  else {

    const innerPly =
      plyNumber - 1

    const plyFactors = {
      2: 2.4,
      3: 3.4,
      4: 4.8,
      5: 5.8,
      6: 7.2,
      7: 8.2,
    }

    const innerFactor =
      plyFactors[innerPly]

    // TOP

    let topWeight =

      itemDeckle *
      Number(topGsm) *
      gaze *
      1

    topWeight =
      topWeight +
      (topWeight * 3 / 100)

    topWeight =
      (topWeight / 100000000)
      * weightMultiplier

    // INNER

    let innerWeight =

      itemDeckle *
      Number(innerGsm) *
      gaze *
      innerFactor

    innerWeight =
      innerWeight +
      (innerWeight * 3 / 100)

    innerWeight =
      (innerWeight / 100000000)
      * weightMultiplier

    // TOTAL

    const total =
      topWeight + innerWeight

    return {

      sameGsm: false,

      top:
        topWeight.toFixed(2),

      inner:
        innerWeight.toFixed(2),

      total:
        total.toFixed(2),

      innerPly

    }
  }

})(),

      })
    }

    setCases(generatedCases)
  }
const fetchReels = async () => {
  try {
    const response = await axios.get(
      "https://sp-packaging.onrender.com/api/reels"
    )
    console.log("Fetched reels:", response.data)
    setAvailableReels(response.data)
  }
  catch (error) {
    console.log("Fetch error:", error)
  }
}

const fetchMatchingReels = async (deckle) => {

  try {

    const response = await axios.get(

      "https://sp-packaging.onrender.com/api/reels"

    )

    const reels = response.data

    // FILTER MATCHING REELS

    const matched = reels.filter(

      (reel) => reel.reelSize === deckle

    )

    setMatchingReels(matched)

  }

  catch (error) {

    console.log(error)

  }

}

  return (

    <DashboardLayout title="Box Calculation">

      <div className="space-y-8">

        {/* INPUT CARD */}

        <div className="bg-white rounded-2xl shadow-sm p-8">

          <h2 className="text-2xl font-bold mb-6">
            Box Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

            {/* BOX SIZE */}

            <div>

              <label className="block text-lg font-medium mb-2">
                Box Size
              </label>

              <input
                type="text"
                placeholder="L x B x H"
                value={boxSize}
                onChange={(e) => setBoxSize(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-5 py-3 text-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* BOXES */}

            <div>

              <label className="block text-lg font-medium mb-2">
                No. of Boxes
              </label>

              <input
                type="number"
                value={boxCount}
                onChange={(e) => setBoxCount(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-5 py-3 text-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* PLY */}

            <div>

              <label className="block text-lg font-medium mb-2">
                Ply
              </label>

              <select
                value={ply}
                onChange={(e) => setPly(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-5 py-3 text-lg outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="3">3 Ply</option>
                <option value="5">5 Ply</option>
                <option value="7">7 Ply</option>

              </select>

            </div>

            {/* TOP GSM */}

            <div>

              <label className="block text-lg font-medium mb-2">
                Top GSM
              </label>

              <select
                value={topGsm}
                onChange={(e) => setTopGsm(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-5 py-3 text-lg outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option>120</option>
                <option>140</option>
                <option>150</option>
                <option>180</option>
                <option>230</option>

              </select>

            </div>

            {/* INNER GSM */}

            <div>

              <label className="block text-lg font-medium mb-2">
                Inner GSM
              </label>

              <select
                value={innerGsm}
                onChange={(e) => setInnerGsm(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-5 py-3 text-lg outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option>120</option>
                <option>140</option>
                <option>150</option>
                <option>180</option>
                <option>230</option>

              </select>

            </div>

          </div>

          {/* BUTTON */}

          <div className="mt-6">

            <button
              onClick={handleCalculate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg font-medium"
            >
              Calculate
            </button>

          </div>

        </div>

        {/* CASES */}

{
  cases.length > 0 && (

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

      {
        cases.map((item, index) => (

          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
          >

            {/* HEADER */}

            <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">

              <div>

  <h2 className="text-2xl font-bold">
    {item.name}
  </h2>

  <p className="text-sm text-blue-100 mt-1">

    {
      item.name === "Case 1A"
      ? "Single Piece"

      : item.name === "Case 1B"
      ? "Two Piece"

      : item.name === "Case 2"
      ? "Single Up"

      : "Double Up"
    }

  </p>

</div>

              <div className="flex gap-3">

                <button

  onClick={() => {

    const text = `

${item.name}
Size : ${boxSize}
Boxes : ${boxCount}
Ply : ${ply}
Gaze : ${item.gaze}
Deckle : ${item.deckle}
Paper Cutting : ${item.pc}
Liner : ${item.liner}
${
  item.weight.sameGsm

  ? `${ply} Ply :
${item.deckle} × ${topGsm} × 18
- ${item.weight.total}`

  :

`Top :
${item.deckle} × ${topGsm} × 18
- ${item.weight.top}

${item.weight.innerPly} Ply :
${item.deckle} × ${innerGsm} × 18
- ${item.weight.inner}

Total Weight :
${item.weight.total}`
}

`
    navigator.clipboard.writeText(text)

    alert("Copied Successfully")

  }}

  className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold"
>

  Copy

</button>

                <button

  onClick={() => {

    

    setShowSavePopup(true)

  }}

  className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold"
>

  Save

</button>

              </div>

            </div>

            <div className="p-6 space-y-8">

              {/* BASIC DETAILS */}

              <div>

                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Basic Details
                </h3>

                <div className="grid grid-cols-2 gap-4 text-base">

                  <p>
                    <span className="font-semibold">
                      Size:
                    </span>{" "}
                    {boxSize}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Boxes:
                    </span>{" "}
                    {boxCount}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Ply:
                    </span>{" "}
                    {ply}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Gaze:
                    </span>{" "}
                    {item.gaze}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Deckle:
                    </span>{" "}
                    {item.deckle}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Paper Cutting:
                    </span>{" "}
                    {item.pc}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Liner:
                    </span>{" "}
                    {item.liner}
                  </p>

                </div>

              </div>

             {/* WEIGHT DETAILS */}

<div>

  <h3 className="text-xl font-bold text-gray-800 mb-4">
    Weight Details
  </h3>

  <div className="space-y-3 text-base">

    {
      item.weight.sameGsm ? (

        <>

          <p>

            <span className="font-semibold">
              {ply} Ply:
            </span>

            {" "}

            {item.deckle}
            {" × "}
            {topGsm}
            {" × 18"}

            {" - "}

            {item.weight.total}

          </p>

        </>

      ) : (

        <>

          <p>

            <span className="font-semibold">
              Top:
            </span>

            {" "}

            {item.deckle}
            {" × "}
            {topGsm}
            {" × 18"}

            {" - "}

            {item.weight.top}

          </p>

          <p>

            <span className="font-semibold">
              {item.weight.innerPly} Ply:
            </span>

            {" "}

            {item.deckle}
            {" × "}
            {innerGsm}
            {" × 18"}

            {" - "}

            {item.weight.inner}

          </p>

          <p className="pt-2 font-semibold text-blue-600">

            Total Weight :
            {" "}
            {item.weight.total}

          </p>

        </>

      )
    }

  </div>

</div>

              {/* DIAGRAM */}

<div>

  <h3 className="text-xl font-bold text-gray-800 mb-4">
    Diagram
  </h3>

  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 overflow-x-auto">

    <pre className="text-sm font-mono text-gray-700 whitespace-pre">

      {item.diagram}

    </pre>

  </div>

</div>

              {/* AVAILABLE REELS */}

              <div>

                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Available Reels
                </h3>

                <div className="border rounded-xl overflow-hidden">

                  {/* HEADER */}

                  <div className="grid grid-cols-5 bg-gray-100 px-4 py-3 font-semibold text-base">
  <p>Size</p>
  <p>GSM</p>
  <p>BF</p>
  <p>Count</p>
  <p>Weights</p>
</div>

                  {
  item.reels && item.reels.length > 0 ? (

    item.reels.map((reel, reelIndex) => (

      <div
  key={reelIndex}
  className="grid grid-cols-5 px-4 py-3 border-t text-base"
>
  <p>{reel.reelSize || "-"}</p>
  <p>{reel.gsm || "-"}</p>
  <p>{reel.bf || "-"}</p>
  <p>{reel.count || "-"}</p>
  <p>{reel.weights?.join(", ") || "-"}</p>
</div>

    ))

  ) : (

    <div className="px-4 py-4 text-gray-500 text-base">

      No matching reels found

    </div>

  )
}
                </div>

              </div>

            </div>

          </div>

        ))
      }

    </div>

  )
}

      </div>
    {
  showSavePopup && (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl w-full max-w-md p-8 space-y-6">

        <h2 className="text-2xl font-bold">
          Save Item
        </h2>

        {/* COMPANY */}

        <div>

          <label className="block text-base font-medium mb-2">
            Company Name
          </label>

          <input
            type="text"
            value={companyName}
            onChange={(e) =>
              setCompanyName(e.target.value)
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* ITEM */}

        <div>

          <label className="block text-base font-medium mb-2">
            Item Name
          </label>

          <input
            type="text"
            value={itemName}
            onChange={(e) =>
              setItemName(e.target.value)
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* BUTTONS */}

        <div className="flex justify-end gap-4">

          <button

            onClick={() => {

              setShowSavePopup(false)

            }}

            className="px-5 py-3 rounded-xl border border-gray-300"
          >

            Cancel

          </button>

          <button

              onClick={async () => {

              try {

  await axios.post(

    "https://sp-packaging.onrender.com/api/saved-items",

    {

      companyName,

      itemName,

      allCases: cases,

      boxSize,

      boxCount,

      ply,

      topGsm,

      innerGsm,

    }

  )

  alert("Saved Successfully")

  setShowSavePopup(false)

  setCompanyName("")

  setItemName("")

}

catch (error) {

  console.log(error)

}

              
            }}

            className="bg-blue-600 text-white px-5 py-3 rounded-xl"
          >

            Save

          </button>

        </div>

      </div>

    </div>

  )
}
    </DashboardLayout>

  )
}