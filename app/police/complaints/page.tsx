import { DashboardLayout } from "@/components/dashboard-layout"
import { PoliceComplaintsContent } from "@/components/police-complaints"
import { ProtectedRoute } from "@/components/protected-route"

export default function PoliceComplaintsPage() {
  return (
    <ProtectedRoute allowedPortals={['police']}>
      <DashboardLayout>
        <PoliceComplaintsContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
