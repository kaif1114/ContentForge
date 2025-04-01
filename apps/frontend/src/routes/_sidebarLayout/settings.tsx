import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_sidebarLayout/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <div className="border rounded-lg p-4">
        <h4 className="text-sm font-medium mb-4">Account Settings</h4>
        {/* Add settings form here */}
      </div>
    </div>
  )
} 