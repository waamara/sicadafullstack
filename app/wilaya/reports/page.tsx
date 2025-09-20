import { DashboardLayout } from "@/components/dashboard-layout"
import { WilayaReportsContent } from "@/components/wilaya-reports"
import { ProtectedRoute } from "@/components/protected-route"

export default function WilayaReportsPage() {
  return (
    <ProtectedRoute allowedPortals={['wilaya']}>
      <DashboardLayout>
        <WilayaReportsContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
