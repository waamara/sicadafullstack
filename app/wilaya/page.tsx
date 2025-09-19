import { DashboardLayout } from "@/components/dashboard-layout"
import { WilayaDashboardContent } from "@/components/wilaya-dashboard"
import { ProtectedRoute } from "@/components/protected-route"

export default function WilayaPage() {
  return (
    <ProtectedRoute allowedPortals={['wilaya']}>
      <DashboardLayout>
        <WilayaDashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
