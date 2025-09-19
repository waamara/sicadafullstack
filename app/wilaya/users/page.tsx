import { DashboardLayout } from "@/components/dashboard-layout"
import { WilayaUsersContent } from "@/components/wilaya-users"
import { ProtectedRoute } from "@/components/protected-route"

export default function WilayaUsersPage() {
  return (
    <ProtectedRoute allowedPortals={['wilaya']}>
      <DashboardLayout>
        <WilayaUsersContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
