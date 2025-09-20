import { DashboardLayout } from "@/components/dashboard-layout"
import { OverviewContent } from "@/components/overview"
import { ProtectedRoute } from "@/components/protected-route"

export default function HomePage() {
  return (
    <ProtectedRoute allowedPortals={['business']}>
      <DashboardLayout>
        <OverviewContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
