export interface Ticket {
  id: string
  title: string
  type: 'parking' | 'equipment' | 'access' | 'other'
  status: 'pending' | 'approved' | 'rejected'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
  user: {
    name: string
    email: string
    phone: string
    idCard: string
    department: string
    position: string
  }
  description?: string
}

export interface User {
  id: string
  fullName: string
  email: string
  phone: string
  idCard: string
  department: string
  position: string
  status: 'active' | 'inactive'
  createdAt: string
  lastLogin?: string
}

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  pendingTickets: number
  resolvedTickets: number
  totalTickets: number
  recentActivity: Activity[]
}

export interface Activity {
  id: string
  type: 'ticket_created' | 'ticket_approved' | 'ticket_rejected' | 'user_registered'
  description: string
  timestamp: string
  user?: string
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}
