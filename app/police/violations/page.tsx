import { DashboardLayout } from "@/components/dashboard-layout"
import { PoliceViolationsContent } from "@/components/police-violations"
import { ProtectedRoute } from "@/components/protected-route"

export default function PoliceViolationsPage() {
  return (
    <ProtectedRoute allowedPortals={['police']}>
      <DashboardLayout>
        <PoliceViolationsContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
