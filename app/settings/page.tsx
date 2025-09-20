import { DashboardLayout } from "@/components/dashboard-layout"
import { SettingsContent } from "@/components/users"
import { ProtectedRoute } from "@/components/protected-route"

export default function SettingsPage() {
  return (
    <ProtectedRoute allowedPortals={['business']}>
      <DashboardLayout>
        <SettingsContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
