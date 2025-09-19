"use client"

import type React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BarChart3, CreditCard, Settings, HelpCircle, LogOut, Bell, ChevronDown, Shield, Landmark, Users } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

// Navigation configurations for different portals
const businessNavigation = [
  { name: "Overview", href: "/", icon: BarChart3 },
  { name: "User Management", href: "/subscription-plans", icon: Users },
  { name: "Support Tickets", href: "/support", icon: HelpCircle },
  { name: "Settings", href: "/settings", icon: Settings },
]

const policeNavigation = [
  { name: "Dashboard", href: "/police", icon: BarChart3 },
  { name: "Complaints", href: "/police/complaints", icon: HelpCircle },
  { name: "Violations", href: "/police/violations", icon: Settings },
  { name: "Officers", href: "/police/officers", icon: Users },
]

const wilayaNavigation = [
  { name: "Dashboard", href: "/wilaya", icon: BarChart3 },
  { name: "Parking Requests", href: "/wilaya/requests", icon: CreditCard },
  { name: "Parking List", href: "/wilaya/parkings", icon: Settings },
  { name: "Reports", href: "/wilaya/reports", icon: Users },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  // Get navigation based on user's portal
  const getNavigation = () => {
    if (!user) return businessNavigation
    
    switch (user.portal) {
      case 'business':
        return businessNavigation
      case 'police':
        return policeNavigation
      case 'wilaya':
        return wilayaNavigation
      default:
        return businessNavigation
    }
  }

  const navigation = getNavigation()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const getPortalTitle = () => {
    if (!user) return 'Business Portal'
    
    switch (user.portal) {
      case 'business':
        return 'Business Portal'
      case 'police':
        return 'Police Portal'
      case 'wilaya':
        return 'Wilaya Portal'
      default:
        return 'Business Portal'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-none border-sidebar-border">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6">
            <h1 className="text-xl font-semibold text-sidebar-foreground">
              {getPortalTitle()}
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-sidebar-accent "
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      isActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground",
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="px-3 pb-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Top header */}
        <header className="bg-sidebar border-none border-border">
          <div className="flex h-16 items-center justify-between px-6">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Site</span>
              <span>{">"}</span>
              <span className="text-foreground">
                {navigation.find((item) => item.href === pathname)?.name || "Overview"}
              </span>
            </div>

            {/* User menu */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || "/professional-woman-avatar.png"} />
                      <AvatarFallback>
                        {user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-medium">{user?.fullName || 'User'}</p>
                      <p className="text-xs text-muted-foreground">
                        {user?.role === 'police_officer' ? user.rank : user?.position || user?.role || 'User'}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user?.badgeNumber && (
                    <DropdownMenuItem>Badge: {user.badgeNumber}</DropdownMenuItem>
                  )}
                  {user?.station && (
                    <DropdownMenuItem>Station: {user.station}</DropdownMenuItem>
                  )}
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
