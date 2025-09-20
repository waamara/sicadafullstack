import { DashboardLayout } from "@/components/dashboard-layout"
import { PoliceDashboardContent } from "@/components/police-dashboard"
import { ProtectedRoute } from "@/components/protected-route"

export default function PolicePage() {
  return (
    <ProtectedRoute allowedPortals={['police']}>
      <DashboardLayout>
        <PoliceDashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
