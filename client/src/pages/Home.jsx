import DashboardLayout from "../components/DashboardLayout"

export default function Home() {
  return (
    <DashboardLayout title="Home">

      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white shadow-lg mb-6">

        <h2 className="text-2xl font-bold mb-2">
          Packaging ERP System
        </h2>

        <p className="text-sm text-blue-100 leading-relaxed max-w-2xl">
          Manage reel inventory, calculate box production,
          save customer items and generate reports from one platform.
        </p>

      </div>

    </DashboardLayout>
  )
}