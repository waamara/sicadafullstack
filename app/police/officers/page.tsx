import { DashboardLayout } from "@/components/dashboard-layout"
import { PoliceOfficersContent } from "@/components/police-officers"
import { ProtectedRoute } from "@/components/protected-route"

export default function PoliceOfficersPage() {
  return (
    <ProtectedRoute allowedPortals={['police']}>
      <DashboardLayout>
        <PoliceOfficersContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
