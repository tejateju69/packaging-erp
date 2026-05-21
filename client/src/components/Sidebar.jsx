export default function Sidebar() {
  return (
    <div className="w-80 bg-black text-white flex flex-col">

      {/* LOGO */}

      <div className="p-10 border-b border-gray-800">

        <h1 className="text-5xl font-bold leading-tight">
          Packaging ERP
        </h1>

      </div>

      {/* MENU */}

      <div className="flex flex-col gap-4 p-6 mt-6">

        <button className="text-left text-3xl font-medium px-6 py-5 rounded-2xl bg-gray-900 hover:bg-gray-800 transition">
          Home
        </button>

        <button className="text-left text-3xl font-medium px-6 py-5 rounded-2xl hover:bg-gray-800 transition">
          Reels
        </button>

        <button className="text-left text-3xl font-medium px-6 py-5 rounded-2xl hover:bg-gray-800 transition">
          Box Calculation
        </button>

        <button className="text-left text-3xl font-medium px-6 py-5 rounded-2xl hover:bg-gray-800 transition">
          Saved Items
        </button>

        <button className="text-left text-3xl font-medium px-6 py-5 rounded-2xl hover:bg-gray-800 transition">
          Reports
        </button>

      </div>

    </div>
  )
}