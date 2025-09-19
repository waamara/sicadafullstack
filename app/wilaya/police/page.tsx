import { DashboardLayout } from "@/components/dashboard-layout"
import { WilayaPoliceContent } from "@/components/wilaya-police"
import { ProtectedRoute } from "@/components/protected-route"

export default function WilayaPolicePage() {
  return (
    <ProtectedRoute allowedPortals={['wilaya']}>
      <DashboardLayout>
        <WilayaPoliceContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
