import { DashboardLayout } from "@/components/dashboard-layout"
import { WilayaBusinessContent } from "@/components/wilaya-business"
import { ProtectedRoute } from "@/components/protected-route"

export default function WilayaBusinessPage() {
  return (
    <ProtectedRoute allowedPortals={['wilaya']}>
      <DashboardLayout>
        <WilayaBusinessContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
