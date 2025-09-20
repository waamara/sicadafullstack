import { DashboardLayout } from "@/components/dashboard-layout"
import { SupportContent } from "@/components/ticket"
import { ProtectedRoute } from "@/components/protected-route"

export default function SupportPage() {
  return (
    <ProtectedRoute allowedPortals={['business']}>
      <DashboardLayout>
        <SupportContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
