import { DashboardLayout } from "@/components/dashboard-layout"
import { SubscriptionPlansContent } from "@/components/users"
import { ProtectedRoute } from "@/components/protected-route"

export default function SubscriptionPlansPage() {
  return (
    <ProtectedRoute allowedPortals={['business']}>
      <DashboardLayout>
        <SubscriptionPlansContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
