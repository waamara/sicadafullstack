import { DashboardLayout } from "@/components/dashboard-layout"
import { WilayaParkingRequestsContent } from "@/components/wilaya-parking-requests"
import { ProtectedRoute } from "@/components/protected-route"

export default function WilayaParkingRequestsPage() {
  return (
    <ProtectedRoute allowedPortals={['wilaya']}>
      <DashboardLayout>
        <WilayaParkingRequestsContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
