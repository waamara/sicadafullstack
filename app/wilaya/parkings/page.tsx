import { DashboardLayout } from "@/components/dashboard-layout"
import { WilayaParkingListContent } from "@/components/wilaya-parking-list"
import { ProtectedRoute } from "@/components/protected-route"

export default function WilayaParkingListPage() {
  return (
    <ProtectedRoute allowedPortals={['wilaya']}>
      <DashboardLayout>
        <WilayaParkingListContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
